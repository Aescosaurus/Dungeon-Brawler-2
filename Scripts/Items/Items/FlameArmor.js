class FlameArmor extends Item
{
	constructor()
	{
		super()
		
		this.takeDmgCounter.SetCount( 1 )
		
		this.shotPattern = new ShotPattern( 8,0,true )
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/FlameArmor.png" )
		this.bulletAnimPath = "Images/Bullet/Fireball.png"
		this.bulletAnimNFrames = 4
		this.bulletAnimFPS = 16
	}
	
	TriggerTakeDmg( info )
	{
		const angs = this.shotPattern.GetShotAngles( Vec2.Zero(),Vec2.One() )
		
		for( const ang of angs ) this.FireBullet( info.self.pos,ang,info )
	}
}