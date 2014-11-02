Demo for New Releases Spotify Web API endpoint (React)
===========

This is a simple demo for the Spotify Web API [New Releases endpoint](https://developer.spotify.com/web-api/get-list-new-releases/) based on [JMPerez/spotify-new-releases-demo](https://github.com/JMPerez/spotify-new-releases-demo) written using [React](http://facebook.github.io/react).

## Usage

If you want to run it locally, change the `redirectUri` variable in `js/oauth-config.js` to
`http://localhost:8000`.

Then, start a server listening on port 8000. If you have python installed, you can run:

    python -m SimpleHTTPServer 8000

If you want to deploy the project on a site different from `http://localhost:8000` you will need to register your own Application on the [My Applications section of the Developer Site](https://developer.spotify.com/my-applications/). Register the desired redirect uri and edit the file `js/oauth-config.js` replacing the `clientId` and `redirectUri`.

## About React

This is my first attempt to use React. Should you know something in the code that can be improved, please let me know. The code uses `JSXTransformer` to transform the React markup into React functions, since it makes the code more readable and the goal is not to have a production-ready code (i.e. minified and combined). If you want to compile the code, install the `react-tools` and run `jsx` against the `js` folder.

All the React code is in `js/react.js` and it has components for the login/logout buttons, albums list and "load more" button.