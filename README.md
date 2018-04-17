# Repository is deprecated! Development has moved to: https://github.com/ccmjs/ccm-factory
# Factory for ccm components

This factory is used to modify [ccm](https://github.com/akless/ccm) components.

The factory can be accessed via the following url: [https://leoneck.github.io/ccm-factory/](https://leoneck.github.io/ccm-factory/)

## Build
```
npm install
npm run build
```

## Configuration

The following configurations are available for the factory component:

| Configuration parameter              | Type    | Description                              | Default value |
| ------------------------------------ | ------- | ---------------------------------------- | ------------- |
| `preview`                            | Boolean | If set to true a preview of the modified component is displayed | `true`        |
| `show_ccm_fields`                    | Boolean | If set to false the default ccm fields like 'name' are not modifiable | `true`        |
| `use_ace_for_editing`                | Boolean | If set to false, textareas are used for editing | `true`        |
| `url_to_modify`                      | String  | Specify a url to a component that should be modified | `''`          |
| `external_config`                    | String  | Specify an external config file for the component that should be modified | `''`          |
| `key_in_external_config`             | String  | Specify the key in the external configuration that should be modified | `''`          |
| `display_final_component_and_config` | Boolean | If set to false, nothing will be displayed after generating the new component | `true`        |
| `no_bootstrap_container`             | Boolean | Set to true if embedded on a site that already has a bootstrap container div | `false`       |
| `start_values`                       | Object  | Is set by W2C to load a configuration.   | `null`        |

