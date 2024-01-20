class Ghost extends Player
{
	constructor( pos,ctrls )
	{
		super( pos,ctrls,0,"Images/Char/Ghost.png" )
		
		this.spd = 1.7
		
		this.isGhost = true
	}
	
	Update( info )
	{
		// ghost can move through walls
		this.move = this.ctrls.GetMove( info.mouse,info.kbd,this.pos )
		this.move.Normalize()
		this.pos.Add( this.move.Copy().Scale( this.spd ) )
		if( !Utils.RoughlyEquals( this.move.x,0 ) ) this.dir = Math.sign( this.move.x )
		
		if( this.pos.x < 0 ) this.pos.x = info.gfx.width - 1
		else if( this.pos.x >= info.gfx.width ) this.pos.x = 0
		else if( this.pos.y < 0 ) this.pos.y = info.gfx.height - 1
		else if( this.pos.y >= info.gfx.height ) this.pos.y = 0
		
		this.UpdateSuper( info )
		
		this.UpdateAnim( info )
	}
	
	UseSuper( info )
	{
		// what does ghost do as super lol
	}
}