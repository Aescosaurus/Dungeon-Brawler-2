class FireStaff extends Item
{
	constructor()
	{
		super()
		
		this.refire = new Timer( 3.0 )
		
		this.bulletSpd = 1.4
		
		this.spr = SpriteCodex.LoadSpr( "Images/Items/FireStaff.png" )
		this.bulletAnimPath = "Images/Bullet/Fireball.png"
		this.bulletAnimNFrames = 4
		this.bulletAnimFPS = 16
	}
	
	Update( info )
	{
		if( this.refire.Update() && info.enemies.length > 0 )
		{
			this.refire.Reset()
			
			const randEnemy = info.enemies[Utils.RandInt( 0,info.enemies.length )]
			
			this.FireBullet( info.self.pos,Utils.GetAng( info.self.pos,randEnemy.pos ),info )
		}
	}
}