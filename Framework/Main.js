class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.kbd = new Keyboard()
		this.mouse = new Mouse( this.gfx )
		this.gpad = new Gamepad()
		
		this.areaManager = new AreaManager( this.gfx )
	}
	
	Update()
	{
		this.areaManager.Update( this.mouse,this.kbd,this.gpad )
	}
	
	Draw()
	{
		this.areaManager.Draw( this.gfx )
	}
}

const main = new Main()

setInterval( function()
{
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.gpad.PollGamepads()
	main.Update()
	main.Draw()
},1000 / 60.0 )