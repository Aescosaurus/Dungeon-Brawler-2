class Quickbow extends Item
{
	constructor()
	{
		super()
		
		this.pierceCounter.SetCount( 3 )
		
		this.arrowSpread = 15
		this.nArrows = 3
		this.sprayPattern = new SprayPattern( new ShotPattern(),this.arrowSpread,0.1,this.nArrows )
		this.firing = false
		this.selfTarget = Vec2.Zero()
		this.arrowTarget = Vec2.Zero()
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/Quickbow.png" )
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Bullet/Arrow.png" )
	}
	
	Update( info )
	{
		if( this.firing )
		{
			const result = this.sprayPattern.Update( this.selfTarget,this.arrowTarget )
			if( result )
			{
				if( result.done ) this.firing = false
				else
				{
					const angs = result.angs
					for( const ang of angs )
					{
						this.FireBullet( info.self.pos,
						ang - Utils.Deg2Rad( this.arrowSpread * this.nArrows / 2 ),
						info )
					}
				}
			}
		}
	}
	
	TriggerPierce( info )
	{
		this.firing = true
		this.selfTarget = info.self.pos.Copy()
		this.arrowTarget = info.enemy.pos.Copy()
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
	{
		const bullet = super.CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
		// disable pierce so we don't get feedback loop on archer
		bullet.hp = 1
		return( bullet )
	}
}