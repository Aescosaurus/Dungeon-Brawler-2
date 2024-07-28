class Particle
{
	constructor( pos,color,mods )
	{
		this.col = color
		this.mods = mods
		this.pos = pos.Copy()
		this.size = Vec2.One()
		this.dead = false
		for( const mod of mods ) mod.Setup( this )
	}
	
	Update()
	{
		for( const mod of this.mods ) mod.Update()
	}
	
	Draw( gfx )
	{
		gfx.DrawRect( Math.floor( this.pos.x - this.size.x / 2 ),
			Math.floor( this.pos.y - this.size.y / 2 ),
			this.size.x,this.size.y,this.col )
	}
	
	IsDead()
	{
		return( this.dead )
	}
}