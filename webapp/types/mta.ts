/**
 * Represents a generic free-form property bag used throughout an MTA descriptor.
 * The exact structure is defined by the consuming module, resource, or deployment logic.
 */
export interface MtaProperties {
    [key: string]: any;
}

/**
 * Represents a parameter collection consumed by modules, resources, hooks, and provides/requires sections.
 */
export interface MtaParameters {
    [key: string]: any;
}

/**
 * Describes metadata for a property, including whether it is optional and which value type it expects.
 */
export interface MtaMetadataProperty {
    /**
     * Indicates whether a property can be overwritten by a later definition.
     */
    overwritable?: boolean;

    /**
     * Indicates whether the property is optional when the descriptor is evaluated.
     */
    optional?: boolean;

    /**
     * Declared runtime type for the property value.
     */
    datatype?: "str" | "int" | "float" | "bool";
}

/**
 * A dictionary of property metadata keyed by property name.
 */
export interface MtaMetadata {
    [key: string]: MtaMetadataProperty;
}

/**
 * Identifies a file included by reference within the descriptor model.
 */
export interface MtaInclude {
    /**
     * Logical name of the included artifact.
     */
    name: string;

    /**
     * Relative or absolute path to the included file.
     */
    path: string;
}

/**
 * Describes a provisioned capability that a module exposes to the deployment model.
 */
export interface MtaProvides {
    /**
     * Name of the provided capability or service.
     */
    name: string;

    /**
     * Indicates whether the provided capability is visible externally.
     */
    public?: boolean;

    /**
     * Properties exposed by the module through the provide contract.
     */
    properties?: MtaProperties;

    /**
     * Metadata describing the exposed properties.
     */
    "properties-metadata"?: MtaMetadata;

    /**
     * Parameters associated with the provided capability.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the provided capability parameters.
     */
    "parameters-metadata"?: MtaMetadata;
}

/**
 * Represents a dependency declaration for another module, resource, or capability.
 */
export interface MtaRequires {
    /**
     * Name of the required dependency.
     */
    name: string;

    /**
     * Group or logical grouping to which the requirement belongs.
     */
    group?: string;

    /**
     * Optional list identifier for grouped requirements.
     */
    list?: string;

    /**
     * Properties passed to the required dependency.
     */
    properties?: MtaProperties;

    /**
     * Metadata describing the dependency properties.
     */
    "properties-metadata"?: MtaMetadata;

    /**
     * Parameters configured for the dependency.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the dependency parameters.
     */
    "parameters-metadata"?: MtaMetadata;

    /**
     * Included files associated with the dependency declaration.
     */
    includes?: MtaInclude[];
}

/**
 * Defines a deployment hook executed during one or more lifecycle phases.
 */
export interface MtaHook {
    /**
     * Unique hook name.
     */
    name: string;

    /**
     * Hook type, such as a lifecycle or custom execution type.
     */
    type?: string;

    /**
     * Lifecycle phases in which the hook is executed.
     */
    phases?: string[];

    /**
     * Parameters passed to the hook.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the hook parameters.
     */
    "parameters-metadata"?: MtaMetadata;

    /**
     * Additional required dependencies that are evaluated for this hook.
     */
    requires?: Array<{
        /**
         * Name of the dependency required by the hook.
         */
        name: string;

        /**
         * Parameters passed to the dependency.
         */
        parameters?: MtaParameters;

        /**
         * Metadata describing the dependency parameters.
         */
        "parameters-metadata"?: MtaMetadata;
    }>;
}

/**
 * Describes a deployable module inside the MTA descriptor.
 */
export interface MtaModule {
    /**
     * Module name used for reference and deployment identification.
     */
    name: string;

    /**
     * Module type, such as application, service, or build artifact.
     */
    type: string;

    /**
     * Human-readable description of the module.
     */
    description?: string;

    /**
     * Relative path to the module implementation or source directory.
     */
    path?: string;

    /**
     * Module-specific property values.
     */
    properties?: MtaProperties;

    /**
     * Metadata describing the module properties.
     */
    "properties-metadata"?: MtaMetadata;

    /**
     * Parameters that configure the module.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the module parameters.
     */
    "parameters-metadata"?: MtaMetadata;

    /**
     * Build-time parameters supplied to the module during packaging or compilation.
     */
    "build-parameters"?: MtaParameters;

    /**
     * Additional files or descriptors included by the module.
     */
    includes?: MtaInclude[];

    /**
     * Capabilities the module provides to the wider MTA model.
     */
    provides?: MtaProvides[];

    /**
     * Dependencies required by the module.
     */
    requires?: MtaRequires[];

    /**
     * Names of modules that must be deployed before this module.
     */
    "deployed-after"?: string[];

    /**
     * Lifecycle hooks attached to the module.
     */
    hooks?: MtaHook[];
}

/**
 * Describes a shared or external resource referenced by the MTA descriptor.
 */
export interface MtaResource {
    /**
     * Resource name used across the descriptor and deployment graph.
     */
    name: string;

    /**
     * Resource type or provider-specific implementation category.
     */
    type?: string;

    /**
     * Human-readable description of the resource.
     */
    description?: string;

    /**
     * Indicates whether the resource is optional during deployment.
     */
    optional?: boolean;

    /**
     * Indicates whether the resource is active and should be considered in the current deployment.
     */
    active?: boolean;

    /**
     * Resource-specific property values.
     */
    properties?: MtaProperties;

    /**
     * Metadata describing the resource properties.
     */
    "properties-metadata"?: MtaMetadata;

    /**
     * Parameters used to configure the resource.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the resource parameters.
     */
    "parameters-metadata"?: MtaMetadata;

    /**
     * Files included with the resource definition.
     */
    includes?: MtaInclude[];

    /**
     * Dependencies declared by the resource.
     */
    requires?: MtaRequires[];

    /**
     * Lifecycle hooks associated with the resource.
     */
    hooks?: MtaHook[];
}

/**
 * Defines a type extension applied to a module or resource definition in the descriptor.
 */
export interface MtaTypeExtension {
    /**
     * Name of the extended type definition.
     */
    name: string;

    /**
     * Type or definition that is being extended.
     */
    extends: string;

    /**
     * Properties introduced or overridden by the extension.
     */
    properties?: MtaProperties;

    /**
     * Metadata describing the extension properties.
     */
    "properties-metadata"?: MtaMetadata;

    /**
     * Parameters introduced or overridden by the extension.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the extension parameters.
     */
    "parameters-metadata"?: MtaMetadata;
}

/**
 * Root MTA descriptor document describing the overall application, modules, and resources.
 * Schema version: 3.2.0
 */
export interface MtaDescriptor {
    /**
     * Schema version identifier for the descriptor document.
     */
    _schema_version: string;

    /**
     * Unique identifier of the MTA.
     */
    ID: string;

    /**
     * Version of the MTA application.
     */
    version: string;

    /**
     * Optional summary of the MTA purpose.
     */
    description?: string;

    /**
     * Optional provider or supplier name.
     */
    provider?: string;

    /**
     * Optional copyright information.
     */
    copyright?: string;

    /**
     * Modules included in the deployment model.
     */
    modules?: MtaModule[];

    /**
     * Resources referenced by the deployment model.
     */
    resources?: MtaResource[];

    /**
     * Module type extensions registered for the MTA.
     */
    "module-types"?: MtaTypeExtension[];

    /**
     * Resource type extensions registered for the MTA.
     */
    "resource-types"?: MtaTypeExtension[];

    /**
     * Global parameters used throughout the MTA.
     */
    parameters?: MtaParameters;

    /**
     * Metadata describing the global parameters.
     */
    "parameters-metadata"?: MtaMetadata;

    /**
     * Included files for the root descriptor.
     */
    includes?: MtaInclude[];

    /**
     * Global lifecycle hooks defined at the MTA level.
     */
    hooks?: MtaHook[];
}