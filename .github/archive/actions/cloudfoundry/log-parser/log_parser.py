#!/usr/bin/env python3
import os
import re
import shutil
import sys
from pathlib import Path

CRITICAL_PATTERNS = [
    "critical",
    "fatal",
    "panic",
    "out of memory",
    "oom",
    "segmentation fault",
]
ERROR_PATTERNS = [
    "#error#",
    "error",
    "exception",
    "failed",
    "failure",
    "caused by",
    "stack trace",
    "unable to",
    "could not",
    "not found",
    "invalid",
    "denied",
    "authentication failed",
]
WARNING_PATTERNS = [
    "#warn#",
    "#warning#",
    "warning",
    "warn",
    "deprecated",
]

SEVERITY_PRIORITY = {"CRITICAL": 3, "ERROR": 2, "WARNING": 1}


def find_operation_dir(op_id: str | None) -> Path | None:
    root = Path.cwd()
    candidates = []
    if op_id:
        exact = root.glob(f"**/mta-op-{op_id}")
        candidates.extend(list(exact))
    candidates.extend(list(root.glob("**/mta-op-*")))

    unique = []
    seen = set()
    for candidate in candidates:
        if candidate.is_dir() and str(candidate) not in seen:
            unique.append(candidate)
            seen.add(str(candidate))

    if not unique:
        return None

    def mtime_sort(path: Path) -> float:
        try:
            return path.stat().st_mtime
        except OSError:
            return 0.0

    return max(unique, key=mtime_sort)


def normalize_line(raw_line: str) -> str:
    line = raw_line.strip()
    if not line:
        return ""
    line = re.sub(r"^#.*?#(INFO|DEBUG|WARN|WARNING|ERROR|CRITICAL)#", "", line, flags=re.IGNORECASE)
    line = line.replace("#", " ")
    line = re.sub(r"\s+", " ", line).strip()
    return line


def classify_line(line: str) -> str:
    text = line.lower()
    if any(p in text for p in CRITICAL_PATTERNS):
        return "CRITICAL"
    if any(p in text for p in ERROR_PATTERNS):
        return "ERROR"
    if any(p in text for p in WARNING_PATTERNS):
        return "WARNING"
    return "INFO"


def read_lines(file_path: Path) -> list[str]:
    try:
        return file_path.read_text(encoding="utf-8", errors="replace").splitlines()
    except Exception:
        return []


def find_relevant_log_files(base_dir: Path) -> list[Path]:
    if not base_dir or not base_dir.exists():
        return []
    log_files = [p for p in base_dir.rglob("*.log") if p.is_file()]
    dep_files = [p for p in base_dir.rglob("*.txt") if p.is_file() and "summary" not in p.name.lower()]
    return sorted(log_files + dep_files, key=lambda p: p.name.lower())


def aggregate_file_hits(file_path: Path) -> dict[str, list[str]]:
    matches = {"CRITICAL": [], "ERROR": [], "WARNING": [], "INFO": []}
    for raw in read_lines(file_path):
        normalized = normalize_line(raw)
        if not normalized:
            continue
        sev = classify_line(normalized)
        if sev == "INFO":
            continue
        # keep limited matches to avoid massive summary spam
        if len(matches[sev]) < 25:
            matches[sev].append(normalized)
    return matches


def create_summary_md(operation_dir: Path | None, files: list[Path]) -> str:
    lines: list[str] = []
    lines.append("## Deployment log summary")
    lines.append("")

    if operation_dir:
        lines.append(f"- Operation directory: `{operation_dir}`")
    else:
        lines.append("- Operation directory: not found")

    all_hits = []
    for file_path in files:
        hits = aggregate_file_hits(file_path)
        counts = {level: len(hits[level]) for level in ["CRITICAL", "ERROR", "WARNING"]}
        total = sum(counts.values())
        if total:
            all_hits.append((file_path.name, counts, hits))

    lines.append("")
    if all_hits:
        lines.append("### Root cause indicators")
        for name, counts, hits in all_hits:
            if counts["CRITICAL"] or counts["ERROR"]:
                first_error = (hits["CRITICAL"] + hits["ERROR"])[0]
                lines.append(f"- `{name}`: `{first_error}`")
                break
        else:
            lines.append("- No direct error/critical lines detected in the operation logs.")
    else:
        lines.append("- No error, warning, or critical markers detected in the log files.")

    lines.append("")
    for file_path in files:
        hits = aggregate_file_hits(file_path)
        counts = {level: len(hits[level]) for level in ["CRITICAL", "ERROR", "WARNING"]}
        total = sum(counts.values())

        lines.append(f"<details>")
        lines.append(f"<summary><b>{file_path.name}</b> — CRITICAL {counts['CRITICAL']} / ERROR {counts['ERROR']} / WARNING {counts['WARNING']}</summary>")
        lines.append("")

        if total == 0:
            lines.append("- No warning/error/critical entries found in this log file.")
        else:
            for level in ["CRITICAL", "ERROR", "WARNING"]:
                if not hits[level]:
                    continue
                lines.append(f"### {level}")
                for hit in hits[level][:12]:
                    lines.append(f"- `{hit}`")
                lines.append("")

        lines.append("</details>")
        lines.append("")

    return "\n".join(lines)


def write_step_summary(summary: str) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        print(summary)
        return

    with open(summary_path, "a", encoding="utf-8") as handle:
        handle.write(summary)
        handle.write("\n")


def archive_logs(log_files: list[Path], root_dir: Path, archive_name: str) -> Path | None:
    bundle_dir = root_dir / "bundle"
    if bundle_dir.exists():
        shutil.rmtree(bundle_dir)
    bundle_dir.mkdir(parents=True, exist_ok=True)

    for log_file in log_files:
        try:
            shutil.copy2(log_file, bundle_dir / log_file.name)
        except Exception:
            pass

    if not any(bundle_dir.iterdir()):
        return None

    archive_path = root_dir / f"{archive_name}.zip"
    archive = shutil.make_archive(str(root_dir / archive_name), "zip", root_dir=str(bundle_dir), base_dir=".")
    return Path(archive)


def main() -> int:
    op_id = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] != "" else None
    out_root = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("parsed_deploy_logs")
    out_root.mkdir(parents=True, exist_ok=True)

    op_dir = find_operation_dir(op_id)
    if op_dir is not None:
        log_files = find_relevant_log_files(op_dir)
        archive_name = op_dir.name
    else:
        # fallback: scan repository root for any recent mta-op-* directories and log files
        found_dirs = sorted(Path.cwd().glob("**/mta-op-*"), key=lambda p: p.stat().st_mtime, reverse=True)
        if found_dirs:
            op_dir = found_dirs[0]
            log_files = find_relevant_log_files(op_dir)
            archive_name = op_dir.name
        else:
            log_files = find_relevant_log_files(Path.cwd())
            archive_name = "cloudfoundry-deploy-logs"

    if not log_files:
        summary = "## Deployment log summary\n\n- No log files were found in the target operation folder.\n"
        write_step_summary(summary)
        return 0

    summary = create_summary_md(op_dir, log_files)
    write_step_summary(summary)

    archive_path = archive_logs(log_files, out_root, archive_name)
    if archive_path is not None:
        print(f"Created archive: {archive_path}")
    else:
        print("No files were copied into the ZIP bundle.")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # pragma: no cover
        error_summary = "## Deployment log summary\n\n- Parser error: " + str(exc) + "\n"
        write_step_summary(error_summary)
        raise SystemExit(0)
