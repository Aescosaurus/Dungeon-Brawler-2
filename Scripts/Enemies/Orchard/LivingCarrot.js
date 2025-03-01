class LivingCarrot extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/LivingCarrot.png" )
		this.hp = 13
		
		this.spd = 0.24
		
		this.attackTimer = new Timer( 2.5,false,true )
		this.attackPattern = new ShotPattern( 4,-1,true,45 )
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),0,0.3,2 )
		this.bulletSpd = 1.3
		this.bulletRange = 190
		this.targetStyle = TargetFinder.FindClosest
		
		this.curAttack = 0
	}
	
	UpdateAttack( info )
	{
		if( this.attackTimer.Update() )
		{
			const target = this.targetStyle( this,info.players )
			if( this.curAttack == 0 )
			{
				const angs = this.attackPattern.GetShotAngles()
				for( const ang of angs ) this.FireBullet( ang,info )
				
				this.attackTimer.Reset()
				this.curAttack = 1
			}
			else
			{
				if( target != null )
				{
					const result = this.sprayPattern.Update( this.pos,target.pos )
					if( result )
					{
						if( result.done )
						{
							this.attackTimer.Reset()
							this.curAttack = 0
						}
						else
						{
							for( const ang of result.angs ) this.FireBullet( ang,info )
						}
					}
				}
				else this.curAttack = 0
			}
		}
	}
}