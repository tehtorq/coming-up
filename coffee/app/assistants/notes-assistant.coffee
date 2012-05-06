class NotesAssistant extends BaseAssistant
  
  constructor: (params = {}) ->
    super
    
    @notes = { items : [] }
    @event = params.event
    @bodyModel = { value : '' }
    
    Mojo.Log.info(JSON.stringify(@event))
    
  setupMenu: ->
    menu_items = [
      {label: "About", command: 'about-scene'}
    ]

    @controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, {visible: true, items: menu_items})
      
  setup: ->
    super
    
    @controller.setupWidget("bodyTextFieldId",
      { focusMode : Mojo.Widget.focusAppendMode, multiline: true },
      @bodyModel
    )
    
    if @showBackNavigation()
      @viewMenuModel = {
        items: [
          {label: $L('Back'), icon:'', command:'back', width:80}
        ]
      }

      @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'no-fade' }, @viewMenuModel)
    
    @controller.setupWidget("textFieldId"
      @attributes =
        hintText: $L("Add a note")
        enterSubmits: true
        requiresEnterKey: true
        autoFocus: false
      @model =
        value: ''
        disabled: false
    )
    
    @controller.setupWidget("list-scroller",{mode: 'vertical'},{})
    
    @setupMenu()
    
    @controller.setupWidget("list", {
      itemTemplate: "notes/note"
      swipeToDelete: false
      hasNoWidgets: true
      # initialAverageRowHeight: 48
      reorderable: true
      }, @notes)
  
  activate: (event) ->
    super
    @controller.get("edit-floater").hide()
    
    @addListeners(
      [@controller.get("list"), Mojo.Event.listTap, @itemTapped]
      [@controller.get("textFieldId"), Mojo.Event.propertyChange, @textFieldChanged]
      [@controller.get("list"), Mojo.Event.dragStart, @dragStartHandler]
      [@controller.get("edit-cancel"), Mojo.Event.tap, @tapCancel]
      [@controller.get("edit-ok"), Mojo.Event.tap, @tapOk]
    )

    if @notes.items.length is 0
      @loadNotes()
      
  tapCancel: (event) =>
    @controller.get("edit-floater").hide()

  tapOk: (event) =>
    @notes.items[@editIndex].text = @controller.get('bodyTextFieldId').mojo.getValue()
    @saveNotes()
    @controller.get('list').mojo.noticeUpdatedItems(@editIndex, [@notes.items[@editIndex]])
    @controller.get('bodyTextFieldId').mojo.setValue("")
    @controller.get("edit-floater").hide()
      
  dragStartHandler: (event) =>
    if (Math.abs(event.filteredDistance.x) > Math.abs(event.filteredDistance.y) * 2)
      @crossing_off = true
      node = event.target.up(".thing")
      node.insert('<div class="draggable-thingy"></div>', { position: 'before' })
      Mojo.Drag.setupDropContainer(node, @)
      
      draggy = node.down(".draggable-thingy")
      draggy.style.left = event.x
      draggy.style.top = event.y

      node._dragObj = Mojo.Drag.startDragging(@controller, draggy, event.down, {
        preventVertical: false,
        draggingClass: "draggy",
        preventDropReset: false
      })

      event.stop()
      
  dragEnter: (element) =>
    Banner.send "drag enter"
    
  dragLeave: (element) =>
    Banner.send "drag leave"
    @crossing_off = false

  dragHover: (element) =>

  dragDrop: (element) =>
    Banner.send "drag drop: #{@crossing_off}"
    
    if @crossing_off
      el = element.up(".thing").down(".event-holder")
      content = "<s>" + el.innerHTML + "</s>"
      el.update(content)
      @crossing_off = false
  
  deactivate: (event) ->
    super
  
  cleanup: (event) ->
    super
    
  ready: ->
    @controller.get('content-area').style.height = "#{@controller.window.innerHeight - 50}px"
    @controller.get('list-scroller').style.height = "#{@controller.window.innerHeight - 50}px"
    
  textFieldChanged: (event) =>
    value = @controller.get('textFieldId').mojo.getValue()
    
    if value isnt ""
      @controller.get('textFieldId').mojo.setValue("")
      @addNewNote(value)
      
    @controller.window.setTimeout(
      =>
        @controller.get('textFieldId').mojo.focus()
      10
    )
    
  handleDeleteItem: (event) =>
    @notes.items.splice(event.index, 1)
    @saveNotes()
  
  saveNotes: =>
    @depot.add("notes#{@event.id}", JSON.stringify(@notes.items))
    
  loadNotes: =>
    @depot = new Mojo.Depot(
      {name: "notes#{@event.id}"}
      =>
        @depot.get("notes#{@event.id}", @handleLoadNotesResponse, =>)
      =>
    )
      
  addNewNote: (string) =>
    Mojo.Log.info string
    @notes.items.push({text: string, event_id: @event.id})
    @controller.get("list").mojo.invalidateItems(0)
    @controller.modelChanged(@notes)
    @saveNotes()
  
  handleLoadNotesResponse: (response) =>
    Mojo.Log.info "notes"
    Mojo.Log.info(JSON.stringify(response))
    
    if response isnt null
      notes = JSON.parse(response)
      @notes.items = _.select notes, (note) => note.event_id is @event.id
      
    @controller.modelChanged(@notes)
  
  itemTapped: (event) =>
    element_tapped = event.originalEvent.target
    
    @editIndex = event.index
    @controller.get("edit-floater").show()
    text = @notes.items[event.index].text
    @controller.get('bodyTextFieldId').mojo.setValue(text)
    Mojo.Log.info @controller.get('bodyTextFieldId').innerHTML
    @controller.get("edit-floater").show()
    @controller.get('bodyTextFieldId').mojo.focus()
      
  handleCommand: (event) ->
    return if event.type isnt Mojo.Event.command
    
    switch event.command
      when 'back'
        @controller.stageController.popScene()
      when 'about-scene'
        @controller.stageController.pushScene({name:"about"}, {})
      when 'donation-cmd'
        AppAssistant.open_donation_link()
      when 'purchase-cmd'
        AppAssistant.open_purchase_link()