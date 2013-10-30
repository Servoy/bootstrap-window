# bootstrap-window

> bootstrap-window is a bootstrap 3.0.0 compatible window and window management solution.  bootstrap-window provides the ability to create event driven windows based on the bootstrap styles.



## Getting Started
This project requires Grunt `~0.4.0`
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

### Building
To build bootstrap-window, you must first change to the project directory and install the necessary dependencies:
<pre>npm install</pre>

Then, you will need to run the grunt build:
<pre>grunt</pre>

Once these processes have been completed, you will find the built bootstrap-window sources in the `dist` directory.

### Usage
Below is an example of using bootstrap-window programmatically.
#### WindowManager
<pre>
    var windowManager = new WindowManager({
        container: "#windowPane",
        windowTemplate: $('#template_element').html()
    });
</pre>
#### Window
<pre>
    var exampleWindow = windowManager.createWindow({
        title: "Bootstrap Window",
        bodyContent: "some body content",
        footerContent: '&lt;button type="button" class="btn btn-default" data-dismiss="window"&gt;Close&lt;/button&gt;&lt;button type="button" class="btn btn-primary"&gt;Submit&lt;/button&gt;'
    });
</pre>
## Release History
 * 2013-10-29   v0.0.8  Refactored WindowManager class to better use prototype inheritance
 * 2013-10-29   v0.0.7  Major refactorization of Window class to use prototype inheritance, Added unit tests for Window class, Updated README
 * 2013-10-28   v0.0.6  Improved versioning in preparation for initial minor release, windows now fade to match the normal bootstrap modal
 * 2013-10-28   v0.0.5  Updated to add readme and improve details
 * 2013-10-28   v0.0.4  Minor updates
 * 2013-10-28   v0.0.3  First public source release


---

bootstrap-window is created and maintained by [Elden Armbrust](http://www.linkedin.com/in/eldenarmbrust)

