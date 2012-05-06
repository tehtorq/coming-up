class AboutAssistant extends BaseAssistant
  
  setup: ->
    super
  
    if @showBackNavigation()
      @viewMenuModel = {
        visible: true,
        items: [
          {label: $L('Back'), icon:'', command:'back', width:80}
        ]
      }

      @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'no-fade' }, @viewMenuModel)
      
  handleCommand: (event) ->
    return if event.type isnt Mojo.Event.command

    switch event.command
      when 'back'
        @controller.stageController.popScene()