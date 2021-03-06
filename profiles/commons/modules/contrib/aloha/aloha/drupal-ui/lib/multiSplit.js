define([
  'jquery',
  'ui/surface',
  'ui/component',
  'ui/button',
  'ui/utils',
  'ui/menuButton'
], function ($, Surface, Component, Button, Utils, MenuButton) {
  'use strict';

  /**
   * MultiSplit component type. We override this in Drupal's custom AE UI to be
   * a dropdown instead. The text of the dropdown shows the current value, upon
   * opening the dropdown, the user will see a full list of available options.
   * @class
   * @extends {Component}
   */
  var MultiSplit = Component.extend({

    buttons: [],

    /**
     * Initializes the multisplit component
     * @override
     */
    init: function () {
      this.buttons = this.getButtons();

      // @TRICKY: When we want "remove formatting", we'll need to call
      // getItems() instead of getButtons(). Scott Gonzalez decided this
      // shouldn't be a button, hence getButtons() won't return it.

      // The options that the dropdown button will offer.
      var menuItems = [];
      jQuery.each(this.buttons, function (i, button) {
        var text = button.name.toUpperCase();

        // @todo: POST_COMMIT(Aloha Editor, https://github.com/alohaeditor/Aloha-Editor/issues/747)
        // This is a quick hack to remove the "remove formatting" button from
        // the p/h1/... dropdown; we want it to live elsewhere.
        if (button.name === "removeFormat") {
          return;
        }

        // In Drupal's UI, we don't have "large icons". Rename the class name so
        // that the automatic conversion into data icons can happen in ui/utils.
        // button.icon = button.icon.replace('aloha-large-icon-', 'aloha-icon-')
        menuItems.push({
          text: button.tooltip,
          icon: button.icon,
          click: button.click,
          name: button.name
        });
      });

      // The menu button's default text shows the name of the first menu item.
      var FormatMenuButton = MenuButton.extend({
        text: menuItems[0].text,
        menu: menuItems
      });
      var formatMenuButton = new FormatMenuButton();

      // Ensure the button is shown/hidden depending on the current selection.
      this.element = formatMenuButton.element;
      this.items = formatMenuButton.items;
      // @todo: POST_COMMIT(Aloha Editor, https://github.com/alohaeditor/Aloha-Editor/issues/747)
      // Don't make this assumption! Aloha Editor's UI should pass us the
      // necessary information.
      this.setActiveButton('p');
      Surface.trackRange(this.element);
    },

    show: function (name) {
      if (!name) {
        name = null;
      }
      if (null !== name && this.items[name] !== undefined) {
        this.items[name].element.show();
        this.items[name].visible = true;
        // since we show at least one button now, we need to show the multisplit button
        this.element.show();
      }
    },

    hide: function (name) {
      var item, visible = false;

      if (!name) {
        name = null;
      }
      if (null !== name && this.items[name] !== undefined) {
        this.items[name].element.hide();
        this.items[name].visible = false;

        // now check, if there is a visible button
        for (item in this.items) {
          if (this.items.hasOwnProperty(item)) {
            if (this.items[item].visible) {
              this.element.show();
              visible = true;
              break;
            }
          }
        }

        if (!visible) {
          this.element.hide();
        }
      }
    },

    setActiveButton: function (index) {
      if (index === null) {
        return;
      }

      // Set the text of the dropdown button to the newly selected value.
      var name = (typeof index === 'string') ? index : this.buttons[index].name;

      jQuery('.ui-button-icon-primary', this.element).remove();
      jQuery('<span>')
        .addClass('ui-button-icon-primary spark-icon')
        .attr('data-icon', Utils.getDataIconForClassName(name))
        .prependTo(this.element);
    },

    /**
     * Toggles the multisplit menu
     */
    toggle: function () {},

    /**
     * Opens the multisplit menu
     */
    open: function () {},

    /**
     * Closes the multisplit menu
     */
    close: function () {}
  });

  return MultiSplit;
});
