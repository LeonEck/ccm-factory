/**
 * @overview Nav Menu
 * @author Leon Eck
 * @license The MIT License (MIT)
 */

( function () {

  var component = {

    name: 'navmenu',

    ccm: 'https://akless.github.io/ccm/version/ccm-11.2.1.min.js',

    config: {
      html: {
        main: {
          tag: 'nav',
          class: 'navbar navbar-default',
          inner: {
            tag: 'div',
            class: 'container-fluid',
            inner: [
              {
                tag: 'div',
                class: 'navbar-header',
                inner: {
                  tag: 'a',
                  class: 'navbar-brand',
                  inner: '%title%'
                }
              },
              {
                tag: 'ul',
                id: 'topNavigation',
                class: 'nav navbar-nav'
              }
            ]
          }
        }
      },
      title: '',
      css_layout: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' ]
    },

    Instance: function () {

      var self = this;

      var main_elem;

      this.start = function () {

        main_elem = this.ccm.helper.html(this.html.main, {
          title: this.title
        });
        this.element.appendChild(main_elem);
      };

      this.setItems = function (items) {
        var topNav = main_elem.querySelector('#topNavigation');
        topNav.innerHTML = '';
        items.split(',').forEach(function (element) {
          var liel = document.createElement('li');
          var ael = document.createElement('a');
          liel.appendChild(ael);
          ael.innerText = element;
          ael.href = '#';
          ael.addEventListener('click', function (event) {
            self.setAllInactive();
            var target = event.target || event.srcElement;
            target.parentNode.classList.add('active');
            document.dispatchEvent(new CustomEvent('nav-selected', {bubbles: true, composed: true, detail: target.text}));
          });
          topNav.appendChild(liel);
        });
      };

      this.setAllInactive = function () {
        var navigationItems = main_elem.querySelectorAll('li');
        Array.from(navigationItems).forEach(function (item) {
          item.classList.remove('active');
        });
      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );