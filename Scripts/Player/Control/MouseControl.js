class MouseControl extends PlayerControl
{
	constructor()
	{
		super( false )
		
		// prevent player from flickering left to right when on top of mouse
		this.minDiff = 4
		
		this.isMouse = true
	}
	
	GetMove( mouse,kbd,gpad,myPos )
	{
		const mousePos = new Vec2( mouse.x,mouse.y )
		const diff = mousePos.Subtract( myPos )
		
		return( ( diff.GetLenSq() > Math.pow( this.minDiff,2 ) && mouse.moved )
			? diff.Normalize() : Vec2.Zero() )
	}
	
	HoldingSuperKeys( mouse,kbd,gpad )
	{
		return( mouse.down )
	}
}