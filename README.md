backbone.flux
=============

### Prelude

After seeing the [Flux overview](http://facebook.github.io/react/docs/flux-overview.html), I couldn't contain my enthusiasm so I started experimenting with React and Flux in the context of the work I'm currently doing for Anyroad using mainly vanilla Backbone for managing views and encapsulation without much client side rendering.

My goal is to experiment with React and the Flux architecture and extract abstractions over Backbone that allow me to implement Flux components.

## Components

### Model store

The [Backbone.Flux.ModelStore](https://github.com/bogdan-dumitru/backbone.flux/blob/master/src/store.coffee#L4) acts as a wrapper for a Backbone.Model and extends Backbone.Events. It acts as the central autority for a backbone model.

It must be extended and provided a model class to work with:

```javascript
App.Stores.Users = _.extend(Backbone.Flux.ModelStore, {
  model: App.Models.User
});
```




