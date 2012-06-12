class PrefsAssistant extends BaseAssistant
  
  constructor: (params) ->
    super

  setup: ->
    super
    
    value13 = AppAssistant.cookieValue("prefs-sync-enabled", "off")
    value14 = AppAssistant.cookieValue("prefs-sync-username", "")
    value15 = AppAssistant.cookieValue("prefs-sync-password", "")

    @controller.setupWidget("syncToggleButton",
      { trueValue : "on", falseValue : "off"}
      {value: value13, disabled: false}
    )
    
    @controller.setupWidget "usernameTextFieldId", { 
      focusMode: Mojo.Widget.focusSelectMode
      textCase: Mojo.Widget.steModeLowerCase, maxLength : 30
      }
      {value: value14}

    @controller.setupWidget "passwordTextFieldId", {
      focusMode : Mojo.Widget.focusSelectMode
      textCase : Mojo.Widget.steModeLowerCase, maxLength : 30
      },
      {value: value15}
        
    if @showBackNavigation()
      @viewMenuModel =
        {
          visible: true,
          items: [
            {label: $L('Back'), icon:'', command:'back', width:80}
          ]
        }
    
      @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'no-fade' }, @viewMenuModel)

  activate: (event) ->
    super
    
    @addListeners(
      [@controller.get("syncToggleButton"), Mojo.Event.propertyChange, @handleUpdate13]
      [@controller.get("usernameTextFieldId"), Mojo.Event.propertyChange, @handleUpdate14]
      [@controller.get("passwordTextFieldId"), Mojo.Event.propertyChange, @handleUpdate15]
    )
  
  ready: ->
    @controller.setInitialFocusedElement(null)
  
  handleUpdate13: (event) =>
    cookie = new Mojo.Model.Cookie("prefs-sync-enabled")
    cookie.put(event.value)

  handleUpdate14: (event) =>
    cookie = new Mojo.Model.Cookie("prefs-sync-username")
    cookie.put(event.value)

  handleUpdate15: (event) =>
    cookie = new Mojo.Model.Cookie("prefs-sync-password")
    cookie.put(event.value)
    
  handleCommand: (event) ->
    return unless event.type is Mojo.Event.command

    switch event.command
      when 'back'
        @controller.stageController.popScene()
