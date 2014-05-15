Backbone.Flux.Store = _.extend Backbone.Events,
  isStore: true

Backbone.Flux.ModelStore = _.extend Backbone.Flux.Store,
  models: {}

  require: (id) ->
    @models[id] ?= @loadModel(id)

  loadModel: (id) ->
    throw 'Model not specified on store' unless @model
    instance = new @model(id: id)
    instance.fetch()
    instance.on('all', (ev) =>
      uri_ev = "#{id}:#{ev}"
      if m = /change:(.*)/.exec(ev)
        # Event of type change:<attr> -> attach the new attr value
        @trigger(uri_ev, instance.get(m[1]))
      else
        @trigger(uri_ev)
    )
    return instance

  update: (id, attributes) ->
    @models[id].save(attributes,
      patch: true
      success: =>
        @trigger("#{id}:update:#{attr}:success") for attr, v of attributes
        @trigger("#{id}:update:success")
      error: =>
        # TODO: attach error if it's attr related or maybe something
        # to indicate it hasn't updated because of other
        # reasons, maybe validity. Check it out.
        @trigger("#{id}:update:#{attr}:error") for attr, v of attributes
        @trigger("#{id}:update:error")
    )

