class Arrow extends Item
{
	constructor()
	{
		super()
		
		this.hitCounter.SetCount( 3 )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Bullet/Arrow.png" )
	}
	
	TriggerHit( info )
	{
		this.buffs.push( new Buff( BuffType.Piercing,1 ) )
	}
}