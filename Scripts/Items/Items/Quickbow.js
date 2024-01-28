class Quickbow extends Item
{
	constructor()
	{
		super()
		
		this.pierceCounter.SetCount( 3 )
		
		this.arrowCounter = new Counter( 3,true )
		this.arrowRefire = new Timer( 0.1,true )
		
		this.nArrows = this.arrowCounter.GetCount()
		this.arrowSpread = Utils.Deg2Rad( 15 )
		this.arrowStartAng = 0
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/Quickbow.png" )
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Bullet/Arrow.png" )
	}
	
	Update( info )
	{
		if( !this.arrowCounter.IsDone() )
		{
			if( this.arrowRefire.Update() )
			{
				this.arrowRefire.Reset()
				this.arrowCounter.Tick()
				
				// const ang = this.arrowStartAng +
				// 	( ( this.arrowCounter.GetCount() / this.nArrows ) -
				// 	this.nArrows / 2 ) * this.arrowSpread
				const ang = this.arrowStartAng +
					( this.arrowCounter.GetPercent() / 2 ) * this.arrowSpread
				
				this.FireBullet( info.self.pos,ang,info )
			}
		}
	}
	
	TriggerPierce( info )
	{
		this.arrowCounter.Reset()
		this.arrowStartAng = Utils.GetAng( info.self.pos,info.enemy.pos )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
	{
		const bullet = super.CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
		// disable pierce so we don't get feedback loop on archer
		bullet.hp = 1
		return( bullet )
	}
}