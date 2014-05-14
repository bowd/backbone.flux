Backbone.Flux.Mixins.StoreBinding = 
  componentWillMount: ->
    @bindStoreEventsFor(@props)

  componentWillReceiveProps: (next_props) ->
    @bindStoreEventsFor(next_props, @props)

  bindStoreEventsFor: (props, old_props) ->
    for storekey, events of @storeEvents
      store = @normaliseStore(storekey)
      for evd, fn of events
        [action, ev] = @splitActionEvent(evd)
        normalised_ev = @normaliseStoreEvent(ev, props)
        unless old_props is undefined
          old_normalised_ev = @normaliseStoreEvent(ev, old_props)
          if normalised_ev isnt old_normalised_ev
            store.off(old_normalised_ev, @[fn])
            store[action](normalised_ev, @[fn])
        else
          store[action](normalised_ev, @[fn])

  splitActionEvent: (evd) ->
    [action, ev] = evd.split(' ')
    # Defacult action to 'on'
    unless _.present(ev) 
      ev = action
      action = 'on'
    return [action, ev]

  normaliseStore: (storekey) ->
    store = _.inject(storekey.split('.'), (memo, el) -> 
      memo[el] || {}
    , window)

    if store.isStore is false
      throw "Storekey #{storekey} does not seam to point to a store."
    else
      store

  normaliseStoreEvent: (ev, props) ->
    ev_parts = ev.split(':')
    return _.map(ev_parts, (ev_part) ->
      if m = /<(.*)>/.exec(ev_part)
        prop = m[1]
        unless prop of props
          throw "Event segment must be a part of the properties"
        props[prop]
      else
        ev_part
    ).join(':')
