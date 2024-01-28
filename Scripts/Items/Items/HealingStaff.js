class HealingStaff extends Item
{
	constructor()
	{
		super()
		
		this.refire = new Timer( 5.0 )
		
		this.heal = 5
		
		this.bulletSpd = 1
		this.bulletRange = 900
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/HealStaff.png" )
		this.bulletAnimPath = "Images/Bullet/HealBullet.png"
	}
	
	Update( info )
	{
		if( this.refire.Update() && info.players.length > 1 )
		{
			this.refire.Reset()
			
			const potentialFriends = []
			for( const player of info.players )
			{
				if( player != info.self ) potentialFriends.push( player )
			}
			const randFriend = potentialFriends[Utils.RandInt( 0,potentialFriends.length )]
			
			const bullet = new AnimBullet( info.self.pos,0,this.bulletSpd,this.bulletRange,
				this.bulletAnimPath,this.bulletAnimNFrames,this.bulletAnimFPS )
			
			bullet.SetSeekTarget( randFriend )
			bullet.canOnlyHitTarget = true
			
			bullet.dmg = -this.heal
			
			info.enemyBullets.push( bullet )
		}
	}
}