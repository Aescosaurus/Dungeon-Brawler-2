class CabbageRoller extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/CabbageRoller.png" )
		this.hp = 11
		
		this.spd = 0.4
		this.moveDelay = new Timer( 3.0,true )
		
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),10,0.15,3,true )
		this.bulletSpd = 1.7
		this.bulletRange = 80
		this.targetStyle = TargetFinder.FindRandom
		
		this.attackTimer = new Timer( 1.5,false,true )
		this.targetPos = null
	}
	
	UpdateAttack( info )
	{
		if( this.attackTimer.Update() )
		{
			if( this.targetPos == null )
			{
				const target = this.targetStyle( this,info.players )
				if( target != null ) this.targetPos = target.pos.Copy()
			}
			else
			{
				const result = this.sprayPattern.Update( this.pos,this.targetPos )
				if( result )
				{
					if( result.done )
					{
						this.attackTimer.Reset()
						this.targetPos = null
					}
					else
					{
						for( const ang of result.angs ) this.FireBullet( ang,info )
					}
				}
			}
		}
	}
}