# \<adom-demo-helper-properties\>

Is a component created for to be used in other demo components with properties

## Structure

With this component you can see your component demo and change his properties, this show the result of component.

__example__

```html
<adom-demo-helper-properties id="view0" toast-events='["click-navigation-button"]' component-name="adom-card-color" properties-setted='[{"label": "color", "value": "#65a5f2", "color": "#65a5f2"}, {"label": "heading", "value": "title"}, {"label": "counter", "value": "4", "type": "number"}, {"label": "units", "value": "components"}, {"label": "icon", "selected": "0", "list": [{"value":"icons:view-module"}, {"value": "icons:view-carousel"}, {"value": "icons:touch-app"}, {"value": "icons:today"}]}, {"label": "reverse", "selected": "1", "list": [{"value": "false"}, {"value": "true"}]}]'>
  <adom-demo-marked>
  </demo-snippet>
</adom-demo-helper-properties>
```

## Styling

The following custom properties and mixins are available for styling:

Custom property                           | Description                                             | Default  |
------------------------------------------|---------------------------------------------------------|----------|
--adom-demo-helper-properties                               | mixin for host                                          | {}       |
--adom-demo-helper-properties-toast-content-color           | color for contentColor                                  | green    |
--adom-demo-helper-properties-content-page                  | mixin for .contentPage class                            | {}       |
--adom-demo-helper-properties-content-page-info             | mixin for .contentPage__info class                      | {}       |
--adom-demo-helper-properties-content-page-info-heading     | mixin for .contentPage__info__heading class             | {}       |
--adom-demo-helper-properties-content-page-info-description | mixin for .contentPage__info__heading_description class | {}       |

## Serving your Application

You can serve your application with:

    $ gulp serve
