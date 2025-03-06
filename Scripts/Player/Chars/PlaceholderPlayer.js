class PlaceholderPlayer extends Player
{
	constructor( ctrls )
	{
		super( new Vec2( -9999,-9999 ),ctrls,1,null )
		
		this.isPlaceholder = true
		this.targetable = false
		
		this.spawnIn = false
	}
	
	Update( info )
	{
		const move = this.ctrls.GetMove( info.mouse,info.kbd,info.gpad,this.pos )
		if( !move.Equals( Vec2.Zero() ) ) this.spawnIn = true
		
		this.UpdateSuper( info )
	}
	
	UpdateMisc()
	{
		// no update misc
	}
	
	Draw( gfx )
	{
		// no draw
	}
	
	UseSuper( info )
	{
		this.spawnIn = true
	}
	
	Damage( dmg,attacker )
	{
		return( false )
	}
	
	Heal( amount,healer )
	{
		return( false )
	}
	
	SpawnIn()
	{
		return( this.spawnIn )
	}
}