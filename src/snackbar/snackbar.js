/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /**
   * Class constructor for Snackbar MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialSnackbar = function MaterialSnackbar(element) {
    this.element_ = element;
    this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE);
    var actionElements = this.element_.querySelectorAll('.' + this.cssClasses_.ACTION);
    this.actionElement_ = actionElements[0];
    this.secondaryActionElement_ = actionElements[1];
    if (!this.textElement_) {
      throw new Error('There must be a message element for a snackbar.');
    }
    if (!this.actionElement_) {
      throw new Error('There must be an action element for a snackbar.');
    }
    this.active = false;
    this.actionHandler_ = undefined;
    this.secondaryActionHandler = undefined;
    this.message_ = undefined;
    this.actionText_ = undefined;
    this.secondaryActionText_ = undefined;
    this.queuedNotifications_ = [];
    this.setActionHidden_(this.actionElement_, true);
    if (this.secondaryActionElement_) {
      this.setActionHidden_(this.secondaryActionElement_, true);
    }
  };
  window['MaterialSnackbar'] = MaterialSnackbar;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialSnackbar.prototype.Constant_ = {
    // The duration of the snackbar show/hide animation, in ms.
    ANIMATION_LENGTH: 250
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialSnackbar.prototype.cssClasses_ = {
    SNACKBAR: 'mdl-snackbar',
    MESSAGE: 'mdl-snackbar__text',
    ACTION: 'mdl-snackbar__action',
    ACTIVE: 'mdl-snackbar--active'
  };

  /**
   * Display the snackbar.
   *
   * @private
   */
  MaterialSnackbar.prototype.displaySnackbar_ = function () {
    this.element_.setAttribute('aria-hidden', 'true');

    if (this.actionHandler_) {
      this.actionElement_.textContent = this.actionText_;
      this.actionElement_.addEventListener('click', function () {
        this.actionHandler_();
        clearTimeout(this.cleanupTimeout_);
        this.cleanup_();
      }.bind(this));
      this.setActionHidden_(this.actionElement_, false);
    }

    if (!this.secondaryActionText_ && this.secondaryActionElement_) {
      this.secondaryActionElement_.setAttribute('hidden', 'true');
    }

    if (this.secondaryActionHandler_) {
      this.secondaryActionElement_.textContent = this.secondaryActionText_;
      this.secondaryActionElement_.addEventListener('click', function () {
        this.secondaryActionHandler_();
        clearTimeout(this.cleanupTimeout_);
        this.cleanup_();
      }.bind(this));
      this.setActionHidden_(this.secondaryActionElement_, false);
    }

    this.textElement_.textContent = this.message_;
    this.element_.classList.add(this.cssClasses_.ACTIVE);
    this.element_.setAttribute('aria-hidden', 'false');
    this.cleanupTimeout_ = setTimeout(this.cleanup_.bind(this), this.timeout_);
  };

  /**
   * Show the snackbar.
   *
   * @param {Object} data The data for the notification.
   * @public
   */
  MaterialSnackbar.prototype.showSnackbar = function (data) {
    if (data === undefined) {
      throw new Error(
        'Please provide a data object with at least a message to display.');
    }
    if (data['message'] === undefined) {
      throw new Error('Please provide a message to be displayed.');
    }
    if (data['actionHandler'] && !data['actionText']) {
      throw new Error('Please provide action text with the handler.');
    }
    if (this.active) {
      this.queuedNotifications_.push(data);
    } else {
      this.active = true;
      this.message_ = data['message'];
      if (data['timeout']) {
        this.timeout_ = data['timeout'];
      } else {
        this.timeout_ = 2750;
      }
      if (data['actionHandler']) {
        this.actionHandler_ = data['actionHandler'];
      }
      if (data['secondaryActionHandler']) {
        this.secondaryActionHandler_ = data['secondaryActionHandler'];
      }
      if (data['actionText']) {
        this.actionText_ = data['actionText'];
      }
      if (data['secondaryActionText']) {
        this.secondaryActionText_ = data['secondaryActionText'];
      }
      this.displaySnackbar_();
    }
  };
  MaterialSnackbar.prototype['showSnackbar'] = MaterialSnackbar.prototype.showSnackbar;

  /**
   * Check if the queue has items within it.
   * If it does, display the next entry.
   *
   * @private
   */
  MaterialSnackbar.prototype.checkQueue_ = function () {
    if (this.queuedNotifications_.length > 0) {
      this.showSnackbar(this.queuedNotifications_.shift());
    }
  };

  /**
   * Cleanup the snackbar event listeners and accessiblity attributes.
   *
   * @private
   */
  MaterialSnackbar.prototype.cleanup_ = function () {
    this.element_.classList.remove(this.cssClasses_.ACTIVE);
    setTimeout(function () {
      this.element_.setAttribute('aria-hidden', 'true');
      this.textElement_.textContent = '';
      if (!Boolean(this.actionElement_.getAttribute('aria-hidden'))) {
        this.setActionHidden_(this.actionElement_, true);
        this.actionElement_.textContent = '';
        this.actionElement_.removeEventListener('click', this.actionHandler_);
      }
      if (this.secondaryActionElement_ && !Boolean(this.secondaryActionElement_.getAttribute('aria-hidden'))) {
        this.setActionHidden_(this.secondaryActionElement_, true);
        this.secondaryActionElement_.textContent = '';
        this.secondaryActionElement_.removeEventListener('click', this.secondaryActionHandler_);
      }
      this.actionHandler_ = undefined;
      this.secondaryActionHandler_ = undefined;
      this.message_ = undefined;
      this.actionText_ = undefined;
      this.secondaryActionText_ = undefined;
      this.active = false;
      this.checkQueue_();
    }.bind(this), /** @type {number} */(this.Constant_.ANIMATION_LENGTH));
  };

  /**
   * Set the action handler hidden state.
   *
   * @param {boolean} value
   * @private
   */
  MaterialSnackbar.prototype.setActionHidden_ = function (actionElement, value) {
    if (value) {
      actionElement.setAttribute('aria-hidden', 'true');
    } else {
      actionElement.removeAttribute('aria-hidden');
    }
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialSnackbar,
    classAsString: 'MaterialSnackbar',
    cssClass: 'mdl-js-snackbar',
    widget: true
  });
})();
export default MaterialSnackbar;