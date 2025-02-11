class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.kbd = new Keyboard()
		this.mouse = new Mouse( this.gfx )
		this.gpad = new Gamepad()
		
		this.areaManager = new AreaManager( this.gfx )
		
		this.canFullscreen = true
	}
	
	Update()
	{
		if( this.kbd.KeyDown( "F" ) )
		{
			if( this.canFullscreen )
			{
				this.canFullscreen = false
				if( this.gfx.IsFullscreen() ) this.gfx.RestoreSmallScreen()
				else this.gfx.CheckFullscreen( true )
			}
		}
		else this.canFullscreen = true
		
		this.areaManager.Update( this.mouse,this.kbd,this.gpad )
	}
	
	Draw()
	{
		this.areaManager.Draw( this.gfx )
	}
}

Main.CheatsEnabled = true

const main = new Main()

setInterval( function()
{
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.gpad.PollGamepads()
	main.Update()
	main.Draw()
},1000 / 60.0 )