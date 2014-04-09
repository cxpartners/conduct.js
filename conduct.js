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
 * @param Array breakpoints
 *   Array of callbacks and media queries in the following format.
 *
 *     [
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
 *         match: function() {
 *           // This code will run when this media query moves from an unmatched state to a matched state
 *         },
 *         unmatch: function() {
 *           // This code will run when this media query moves from a matched state to an unmatched state
 *         }
 *       },
 *     ]
 *
 * Important note: The order that these callbacks appear in the array is important.
 * When resizing *up*, the callbacks will be unmatched and matched in an ascending order.
 * When resizing *down*, the callbacks will be unmatched and matched in a descending order.
 * The logic behind this is that you tend to want to unmatch a "desktop" breakpoint before matching
 * a "mobile" breakpoint.
 */
var conduct = function(breakpoints) {
  'use strict';

  // Timeout to allow us to debounce the resize event
  var debounce = null;

  // Keep track of the window width between resize events so that we can know whether we are resizing up or down
  var windowSize = window.innerWidth;

  /**
   * Main function which is used to apply a given media query / callback combination
   */
  var apply = function(breakpoint) {
    // Does the media query match?
    if(window.matchMedia(breakpoint.query).matches) {
      // Yes, this breakpoint is active
      // If it *wasn't* active last time we tested, then we have moved from an unmatched to a matched state
      if(!breakpoint.matched) {

        // Run the match callback and record this breakpoint as being currently matched
        //console.log('match:', breakpoint.query)
        setTimeout(function() {
          breakpoint.match();
          breakpoint.matched = true;
        }, 0);
      }
    } else {
      // No, the breakpoint is not active
      // If it *was* active last time we tested, we have moved from a matched to an unmatched state
      if(breakpoint.matched) {

        // Run the unmatch callback and record this breakpoint as being not currently matched
        //console.log('unmatch:', breakpoint.query)
        setTimeout(function() {
          breakpoint.unmatch();
          breakpoint.matched = false;
        }, 0);
      }
    }
  };

  /**
   * Init
   * On page load, run over all the available breakpoints and apply them all
   */
  for (var i=0; i<breakpoints.length; i++) {

    // By default, we'll record that the breakpoint is not matched
    breakpoints[i].matched = false;

    // And then attempt to apply the breakpoint callback if it matches
    apply(breakpoints[i]);
  }

  /**
   * Main resize handler
   */
  var resize = function() {

    // Debounce the resize event
    clearTimeout(debounce);
    debounce = setTimeout(function() {

      // If the last recorded window size was more than current, then we are resizing down
      if(windowSize > window.innerWidth) {

        // Apply the breakpoints in reverse order, starting with the last one in the array
        for (var i=breakpoints.length-1; i >= 0; i--) {
          apply(breakpoints[i]);
        }

      } else if (windowSize < window.innerWidth) {
        // Else if the last recorded window size was less than current, we are resizing up
        // Apply the breakpoints in normal, ascending order starting with the first one in the array
        for (var j=0; j<breakpoints.length; j++) {
          apply(breakpoints[j]);
        }
      }

      // Record the current width of the window so we can compare it on the next resize event
      windowSize = window.innerWidth;

    }, 300);
  };

  // Bind the resize handler to the window resize event
  if (window.addEventListener) {
    window.addEventListener('resize', resize, false);
  } else if (window.attachEvent)  {
    window.attachEvent('onresize', resize);
  }

};
