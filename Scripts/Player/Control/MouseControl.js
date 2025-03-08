class MouseControl extends PlayerControl
{
	constructor()
	{
		super( false )
		
		// prevent player from flickering left to right when on top of mouse
		this.minDiff = 4
		
		this.isMouse = true
		
		this.mouseActivated = false // click once to activate
	}
	
	GetMove( mouse,kbd,gpad,myPos )
	{
		if( mouse.down ) this.mouseActivated = true
		
		const mousePos = new Vec2( mouse.x,mouse.y )
		const diff = mousePos.Subtract( myPos )
		
		return( ( diff.GetLenSq() > Math.pow( this.minDiff,2 ) && mouse.moved && this.mouseActivated )
			? diff.Normalize() : Vec2.Zero() )
	}
	
	HoldingSuperKeys( mouse,kbd,gpad )
	{
		return( mouse.down )
	}
	
	Reset()
	{
		this.mouseActivated = false
	}
}