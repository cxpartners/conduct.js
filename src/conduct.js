/**
* @fileOverview A plugin to manage the execution of javascript callbacks across breakpoints
* @author CX Partners, Andy Mantell
* @name conduct
* @dependencies: None
*/

/**
* Main conduct function.
* For a given array of media queries and callbacks, we will register a resize event and test the media queries,
* applying and unapplying the relevant callbacks at each point.
*
* @param Object breakpoints
*   Object containing an Array (media_queries) of callbacks and media queries in the following format and
*   an optional Number (timeout) to supply a debounce delay in milliseconds.
*    {
*     'media_queries': [
*       {
*         query: 'max-width: 600px',
*         match: function() {
*           // This code will run when this media query moves from an unmatched state to a matched state
*         },
*         unmatch: function() {
*           // This code will run when this media query moves from a matched state to an unmatched state
*         }
*       },
*       {
*         query: 'min-width: 601px',
*         fallback: true,
*         match: function() {
*           // This code will run when this media query moves from an unmatched state to a matched state
*         },
*         unmatch: function() {
*           // This code will run when this media query moves from a matched state to an unmatched state
*         }
*       },
*     ],
*      'timeout': 250
*    }
* Important note: The order that these callbacks appear in the array is important.
* When resizing *up*, the callbacks will be unmatched and matched in an ascending order.
* When resizing *down*, the callbacks will be unmatched and matched in a descending order.
* The logic behind this is that you tend to want to unmatch a "desktop" breakpoint before matching
* a "mobile" breakpoint.
*/

(function() {
  'use strict';

  function Conduct(breakpoints) {

    // Timeout to allow us to debounce the resize event
    var debounce = null;

    // Keep track of the window width between resize events so that we can know whether we are resizing up or down
    var windowSize = window.innerWidth;

    // Fail gracefully if no configuration is specified
    breakpoints = breakpoints || {};
    breakpoints.media_queries = breakpoints.media_queries || [];

    // Set default timeout value
    breakpoints.timeout = breakpoints.timeout || 300;

    /**
    * Evaluate the current breakpoints
    * On page load, run over all the available breakpoints and apply them all
    */
    function evaluate() {
      for (var i = 0; i < breakpoints.media_queries.length; i++) {

        // By default, we'll record that the breakpoint is not matched
        breakpoints.media_queries[i].matched = false;

        // And then attempt to apply the breakpoint callback if it matches
        apply(breakpoints.media_queries[i]);
      }
    }

    /**
    * Main function which is used to apply a given media query / callback combination
    */
    function apply(breakpoint) {

      // If this browser doesn't support matchMedia, just match all breakpoints that are marked as fallbacks
      if(typeof(window.matchMedia) !== 'function') {
        if(breakpoint.fallback && !breakpoint.matched) {
          breakpoint.match();
          breakpoint.matched = true;
        }

        // And then bail out, there's nothing more to do
        return;
      }

      // Does the media query match?
      if (window.matchMedia(breakpoint.query).matches) {
        // Yes, this breakpoint is active
        // If it *wasn't* active last time we tested, then we have moved from an unmatched to a matched state
        if (!breakpoint.matched) {

          // Run the match callback and record this breakpoint as being currently matched
          setTimeout(function() {
            if(typeof(breakpoint.match) === 'function') {
              breakpoint.match();
            }

            breakpoint.matched = true;
          }, 0);
        }
      } else {
        // No, the breakpoint is not active
        // If it *was* active last time we tested, we have moved from a matched to an unmatched state
        if (breakpoint.matched) {

          // Run the unmatch callback and record this breakpoint as being not currently matched
          setTimeout(function() {
            if(typeof(breakpoint.unmatch) === 'function') {
              breakpoint.unmatch();
            }

            breakpoint.matched = false;
          }, 0);
        }
      }
    }

    /**
    * Main resize handler
    */
    function resize() {

      // Debounce the resize event
      clearTimeout(debounce);
      debounce = setTimeout(function() {

        // If the last recorded window size was more than current, then we are resizing down
        if (windowSize > window.innerWidth) {

          // Apply the breakpoints in reverse order, starting with the last one in the array
          for (var i = breakpoints.media_queries.length - 1; i >= 0; i--) {
            apply(breakpoints.media_queries[i]);
          }

        } else if (windowSize < window.innerWidth) {
          // Else if the last recorded window size was less than current, we are resizing up
          // Apply the breakpoints in normal, ascending order starting with the first one in the array
          for (var j = 0; j < breakpoints.media_queries.length; j++) {
            apply(breakpoints.media_queries[j]);
          }
        }

        // Record the current width of the window so we can compare it on the next resize event
        windowSize = window.innerWidth;

      }, breakpoints.timeout);
    }

    // Kick off an initial evaluation of breakpoints
    evaluate();

    // If we've got matchMedia support...
    if(typeof(window.matchMedia) === 'function') {

      // Bind the resize handler to the window resize event
      if (window.addEventListener) {
        window.addEventListener('resize', resize, false);
      } else if (window.attachEvent) {
        window.attachEvent('onresize', resize);
      }
    }

    /**
    * Public methods
    */
    return {
      'evaluate': evaluate
    };

  }

  // Expose as a CommonJS module for browserify
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Conduct;
  } else {
    // Otherwise expose as a global for non browserify users
    window.Conduct = Conduct;
  }

})();
