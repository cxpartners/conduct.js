conduct.js
==========

conduct.js allows JavaScript to respond to media queries by executing callbacks as breakpoints are matched and unmatched. It is inspired by [enquire.js](https://github.com/WickyNilliams/enquire.js/) and arose from the need to gain additional control over the order of execution of breakpoint callbacks.

Basic usage
-----------
Basic usage is as follows:

    var conduct = new Conduct(
      {
        'media_queries':
        [
          {
            query: '(max-width: 600px)',
            match: function() {
              // This code will run when this media query moves from an unmatched state to a matched state
            },
            unmatch: function() {
              // This code will run when this media query moves from a matched state to an unmatched state
            }
          },
          {
            query: '(min-width: 601px)',
            match: function() {
              // This code will run when this media query moves from an unmatched state to a matched state
            },
            unmatch: function() {
              // This code will run when this media query moves from a matched state to an unmatched state
            }
          },
        ],
        'timeout': 300 // optional - default provided
      }
    );

Important note: The order that these callbacks appear in the array is important. When resizing *up*, the callbacks will be unmatched and matched in an ascending order. When resizing *down*, the callbacks will be unmatched and matched in a descending order.

The logic behind this is that you tend to want to unmatch a "desktop" breakpoint before matching a "mobile" breakpoint. This is the main difference with [enquire.js](https://github.com/WickyNilliams/enquire.js/) which uses the addEventListener method of matchMedia to fire the callbacks. In contrast, conduct.js uses a single window resize event and tests the media queries manually. This allows us to run through the callbacks in the order that we desire.
