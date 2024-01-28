class Item
{
	constructor()
	{
		this.hitCounter = new Counter( 0,false,true )
		this.killCounter = new Counter( 0,false,true )
		this.pierceCounter = new Counter( 0,false,true )
		this.takeDmgCounter = new Counter( 0,false,true )
		
		this.spr = null
		this.bulletSpr = null
		this.bulletAnimPath = null
		this.bulletAnimNFrames = 2
		this.bulletAnimFPS = 4
		this.bulletSpd = 2
		this.bulletRange = 100
		
		this.buffs = []
	}
	
	Update( info ) {}
	
	TriggerPickup( info ) {}
	TriggerHit( info ) {}
	TriggerKill( info ) {}
	TriggerPierce( info ) {}
	TriggerTakeDmg( info ) {}
	
	OnEnemyHit( info )
	{
		if( this.hitCounter.Tick() ) this.TriggerHit( info )
	}
	
	OnKill( info )
	{
		if( this.killCounter.Tick() ) this.TriggerKill( info )
	}
	
	OnPierce( info )
	{
		if( this.pierceCounter.Tick() ) this.TriggerPierce( info )
	}
	
	OnTakeDmg( info )
	{
		if( this.takeDmgCounter.Tick() ) this.TriggerTakeDmg( info )
	}
	
	FireBullet( pos,ang,info )
	{
		const itemSelf = this
		
		info.self.ItemFireBullet( pos,ang,
			this.bulletSpd,this.bulletRange,
			info,
			function( pos,ang,bulletSpd,bulletRange,self )
			{
				const bullet = itemSelf.CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
				return( bullet )
			} )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self,itemSelf )
	{
		let bullet = null
		if( this.bulletAnimPath )
		{
			bullet = new AnimBullet( pos,ang,bulletSpd,bulletRange,
				itemSelf.bulletAnimPath,itemSelf.bulletAnimNFrames,
				itemSelf.bulletAnimFPS )
		}
		else
		{
			bullet = self.CreateBullet( pos,ang,bulletSpd,bulletRange,self )
			if( this.bulletSpr ) bullet.spr = itemSelf.bulletSpr
		}
		
		// disable pierce so we don't get feedback loop on archer
		bullet.hp = 1
		
		return( bullet )
	}
}