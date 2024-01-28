class Sword extends Item
{
	constructor()
	{
		super()
		
		this.killCounter.SetCount( 5 )
		
		this.shotPattern = new ShotPattern( 8,0,true )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/Sword.png" )
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Bullet/SwordBolt.png" )
	}
	
	TriggerKill( info )
	{
		const angs = this.shotPattern.GetShotAngles( Vec2.Zero(),Vec2.One() )
		
		for( const ang of angs ) this.FireBullet( info.self.pos,ang,info )
	}
}