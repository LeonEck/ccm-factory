( function() {

  var component = {
    name: 'factory',

    ccm: 'resources/ccm-10.0.0.min.js',

    config: {
      html: {
        "main": {
          "id": "main",
          "inner": [
            {
              "inner": "URL der Komponente:<br>http://localhost:5000/resources/test_components/ccm.navmenu.js<br>http://localhost:5000/resources/test_components/ccm.kanban_card.js<br>"
            },
            {
              "tag": "input",
              "id": "componentURL",
              "size": "70",
              "value": "http://localhost:5000/resources/test_components/ccm.kanban_card.js"
            },
            {
              "tag": "button",
              "inner": "Komponente laden",
              "onclick": "%loadComponentClick%"
            },
            {
              "tag": "br"
            },
            {
              "tag": "div",
              "id": "chooseEditingStyle",
              "style": "display: none;",
              "inner": [
                {
                  "tag": "button",
                  "inner": "Config Editor",
                  "onclick": "%configEditorChosenClick%"
                },{
                  "tag": "button",
                  "inner": "Geführter Modus",
                  "onclick": "%guidedEditingChosenClick%"
                }
              ]
            },
            {
              "tag": "div",
              "id": "areaForConfigEditing",
              "style": "display: none;",
              "inner": [
                {
                  "tag": "textarea",
                  "id": "configEditor",
                  "rows": 20,
                  "cols": 50,
                  "inner": "Config"
                },
                {
                  "tag": "br"
                },
                {
                  "tag": "div",
                  "id": "nameOfNewComponentInput",
                  "inner": [
                    {
                      "inner": "Name der neuen Komponente: "
                    },
                    {
                      "tag": "input",
                      "id": "nameOfNewComponent"
                    },
                    {
                      "tag": "button",
                      "inner": "Neue Komponente generieren",
                      "onclick": "%generateFromEditorClick%"
                    }
                  ]
                }
              ]
            },
            {
              "tag": "div",
              "id": "areaForGuidedEditing",
              "style": "display: none;",
              "inner": [
                {
                  "tag": "h2",
                  "inner": "Geführter Modus zum Editieren der Konfiguration"
                },
                {
                  "inner": [
                    {
                      "tag": "h4",
                      "inner": "CCM Konfiguration"
                    },
                    {
                      "inner": [
                        {
                          "inner": "Name der neuen Komponente: "
                        },
                        {
                          "tag": "input",
                          "id": "guided_nameOfNewComponent"
                        }
                      ]
                    },
                    {
                      "inner": [
                        {
                          "inner": "URL von CCM: "
                        },
                        {
                          "tag": "input",
                          "size": "50",
                          "id": "guided_ccmURL"
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "guided_componentSpecificConfiguration",
                  "inner": [
                    {
                      "tag": "h4",
                      "inner": "Komponenten spezifische Konfiguration"
                    }
                  ]
                },
                {
                  "tag": "button",
                  "inner": "Neue Komponente generieren",
                  "onclick": "%generateFromGuidedClick%"
                }
              ]
            },
            {
              "tag": "br"
            },
            {
              "tag": "textarea",
              "id": "newComponentDisplay",
              "style": "display: none;",
              "rows": 20,
              "cols": 50,
              "inner": "Neue Komponente"
            }
          ]
        }
      }
    },

    Instance: function() {
      var self = this;

      this.start = function() {

        // !ANMERKUNG!: Die Funktionszuweisungen müssen in der richtigen Reihenfolge, entsprechend dem Vorkommen im Json auftauchen
        var mainElement = this.ccm.helper.html(this.html.main, {
          loadComponentClick: loadComponent,
          configEditorChosenClick: configEditorChosen,
          guidedEditingChosenClick: guidedEditingChosen,
          generateFromEditorClick: generateNewComponentFromEditor,
          generateFromGuidedClick: generateNewComponentFromGuided
        });

        this.element.appendChild(mainElement);

        // In here the newly generated component gets stored
        var newComponent;

        /**
         * Downloads the component
         */
        function loadComponent() {
          var urlToComponent = mainElement.querySelector('#componentURL').value;

          self.ccm.load({url: urlToComponent}, function (loadedComponent) {
            newComponent = loadedComponent;

            displayEditingOptions();
          });

        }

        /**
         * Shows the options available for editing the config
         */
        function displayEditingOptions() {
          mainElement.querySelector('#chooseEditingStyle').style.display = 'block';
        }

        /**
         * The config is going to be edited with an editor
         */
        function configEditorChosen() {
          mainElement.querySelector('#chooseEditingStyle').style.display = 'none';
          displayConfigInEditor();
          displayName();
        }

        /**
         * Displays the config editor and the config of the loaded component in it
         */
        function displayConfigInEditor() {
          mainElement.querySelector('#areaForConfigEditing').style.display = 'block';
          mainElement.querySelector('#configEditor').value = JSON.stringify(newComponent.config, null, 2);
        }

        /**
         * Displays the name of the new Component
         */
        function displayName() {
          mainElement.querySelector('#nameOfNewComponent').value = newComponent.name + '-new';
        }

        /**
         * Uses the modified config from the editor to generate a new component
         */
        function generateNewComponentFromEditor() {
          newComponent.name = mainElement.querySelector('#nameOfNewComponent').value;
          newComponent.config = JSON.parse(mainElement.querySelector('#configEditor').value);
          displayNewComponent();
        }

        /**
         * Config is edited through a guided process
         */
        function guidedEditingChosen() {
          mainElement.querySelector('#chooseEditingStyle').style.display = 'none';
          mainElement.querySelector('#areaForGuidedEditing').style.display = 'block';
          fillInCCMGuidedFields();
          generateComponentSpecificFields();
        }

        /**
         * Fills in the standard ccm fields in the guided editing
         */
        function fillInCCMGuidedFields() {
          // component name
          mainElement.querySelector('#guided_nameOfNewComponent').value = newComponent.name + '-new';
          // ccm url
          mainElement.querySelector('#guided_ccmURL').value = newComponent.ccm;
        }

        /**
         * Analyses the config of a given component and generates fields to edit it
         */
        function generateComponentSpecificFields() {
          for (var key in newComponent.config) {
            //console.log(key + " -> " + newComponent.config[key] + " (" + typeof(newComponent.config[key])+ ")");
            switch (typeof(newComponent.config[key])) {
              case 'string':
                generateNewStringField(key, newComponent.config[key]);
                break;
              case 'object':
                // Check if the object is an array
                if (Array.isArray(newComponent.config[key])) {
                  // check if the array is a ccm load instruction, because those will be handled separately
                  if (newComponent.config[key][0] === 'ccm.load') {
                    console.log('ccm load detected !Parsing not implemented! ' + key + ' -> ' + newComponent.config[key] + ' (' + typeof(newComponent.config[key])+ ')');
                  } else {
                    generateArrayEditor(key, newComponent.config[key]);
                  }
                } else {
                  console.log('Object detected !Parsing not implemented! ' + key + ' -> ' + newComponent.config[key] + ' (' + typeof(newComponent.config[key])+ ')');
                }
                break;
              default:
                console.log('!Parsing not implemented! ' + key + ' -> ' + newComponent.config[key] + ' (' + typeof(newComponent.config[key])+ ')');
                break;
            }
          }
        }

        /**
         * Generates an input to modify a string
         * @param key
         * @param value
         */
        function generateNewStringField(key, value) {
          var caption = document.createElement('div');
          caption.innerHTML = key + ':';
          var input = document.createElement('input');
          input.value = value;
          input.id = 'guidedConfParameter_' + key;
          mainElement.querySelector('#guided_componentSpecificConfiguration').appendChild(caption);
          mainElement.querySelector('#guided_componentSpecificConfiguration').appendChild(input);
        }

        /**
         * Generates an editor for arrays
         * @param key
         * @param value
         */
        function generateArrayEditor(key, value) {
          var typeInArray = checkTypeOfArray(value);
          switch (typeInArray) {
            case 'string':
                generateArrayEditorForStrings(key, value);
              break;
            default:
              console.log('Array editor for ' + typeInArray + ' not yet implemented.')
              break;
          }
        }

        /**
         * Generates an editor for arrays containing strings
         * @param key
         * @param value
         */
        function generateArrayEditorStrings(key, value) {
          /*
          TODO:
            - Felder mit den bestehenden Werten anzeigen
            - Einen - Button für jedes Feld anlegen
            - Einen + Button für ein neues Feld
            - Die inputs müssen eine andere id als die restlichen config parameter bekommen und der typ muss auch codiert werden (vielleicht löse ich das indem in nicht mehr über die id gehe sondern über einen custom paramenter, wenn man den abfragen kann?!)
              - Vielleicht wäre ein Wrapper gut, dessen id ich abfragen kann und von dem ich aus dann nur noch die children iterieren muss
            - Bei der erstellung der neuen Config, das Array wieder zusammensetzen
           */
        }

        /**
         * Return the type that all elements of the array have in common
         * @param array
         * @returns {string} Type
         */
        function checkTypeOfArray (array) {
          var numberOfElements = array.length;
          var returnType = 'undefined';
          var typesInArray = {
            "string": 0,
            "number": 0,
            "boolean": 0,
            "object": 0
          };
          array.forEach(function (element) {
            switch (typeof(element)) {
              case 'string':
                typesInArray.string++;
                break;
              case 'number':
                typesInArray.number++;
                break;
              case 'boolean':
                typesInArray.boolean++;
                break;
              case 'object':
                typesInArray.object++;
                break;
              default:
                break;
            }
          });

          if (typesInArray.string === numberOfElements) {
            returnType = 'string';
          } else if (typesInArray.number === numberOfElements) {
            returnType = 'number';
          } else if (typesInArray.boolean === numberOfElements) {
            returnType = 'boolean';
          } else if (typesInArray.object === numberOfElements) {
            returnType = 'object';
          }

          return returnType;
        }

        /**
         * Generates a new component from the guided process
         */
        function generateNewComponentFromGuided() {
          // name
          newComponent.name = mainElement.querySelector('#guided_nameOfNewComponent').value;
          // ccm url
          newComponent.ccm = mainElement.querySelector('#guided_ccmURL').value;
          // custom fields
          var customFields = mainElement.querySelectorAll('input');
          for (var i = 0; i < customFields.length; i++) {
            if (customFields[i].id.startsWith('guidedConfParameter_')) {
              var keyToChange = customFields[i].id.slice(20);
              newComponent.config[keyToChange] = customFields[i].value;
            }
          }

          displayNewComponent();
        }

        /**
         * The new component is displayed in a textarea
         */
        function displayNewComponent() {
          mainElement.querySelector('#newComponentDisplay').style.display = 'block';

          /**
           * 1.replace: Newlines will be visible in the textarea
           * 2. and 3.replace: Removes quotation marks from functions
           */
          var innerPartOfCompoment = JSONfn.stringify(newComponent).replace(/\\n/g, '\r\n').replace(/"function/g, 'function').replace(/}"/g, '}');
          var componentBeginning = '( function () {\n' +
            '\n' +
            '  var component = ';
          var componentEnding = ';\n' +
            '\n' +
            '  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}\n' +
            '}() );';

          mainElement.querySelector('#newComponentDisplay').value = componentBeginning + innerPartOfCompoment + componentEnding;
        }

      };
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}());
