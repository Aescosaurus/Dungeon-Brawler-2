class WASDControl extends PlayerControl
{
	constructor( up,down,left,right )
	{
		super( true )
		
		this.up = up
		this.down = down
		this.left = left
		this.right = right
	}
	
	GetMove( mouse,kbd,gpad,myPos )
	{
		const move = Vec2.Zero()
		if( kbd.KeyDown( this.up ) ) --move.y
		if( kbd.KeyDown( this.down ) ) ++move.y
		if( kbd.KeyDown( this.left ) ) --move.x
		if( kbd.KeyDown( this.right ) ) ++move.x
		move.Normalize()
		return( move )
	}
	
	HoldingSuperKeys( mouse,kbd,gpad )
	{
		return( kbd.KeyDown( this.left ) && kbd.KeyDown( this.right ) )
	}
}