class BanditArcher extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/BanditArcher.png" )
		this.hp = 10
		
		this.spd = 0.3
		this.moveDelay.SetDur( 1.4 )
		
		this.attackTimer = new Timer( 3,false,true )
		this.attackPattern = new ShotPattern( 1 )
		this.sprayPattern = new SprayPattern( this.attackPattern,7,0.4,3 )
		this.bulletSpd = 1
		this.bulletRange = 140
		this.targetStyle = TargetFinder.FindFarthest
		
		this.sprayTargetPos = null
	}
	
	Update( info )
	{
		if( !this.attackTimer.Update() ) this.UpdateMove( info )
		
		this.UpdateAttack( info )
		
		this.UpdateAnim()
	}
	
	UpdateAttack( info )
	{
		if( this.attackTimer.Update() )
		{
			if( this.sprayTargetPos == null )
			{
				const target = this.targetStyle( this,info.players )
				if( target != null )
				{
					this.sprayTargetPos = target.pos.Copy()
					this.dir = Math.sign( this.sprayTargetPos.Copy().Subtract( this.pos ).x )
					this.aiMove.SetXY( 0,0 )
				}
			}
			else
			{
				const result = this.sprayPattern.Update( this.pos,this.sprayTargetPos )
				if( result )
				{
					if( result.done )
					{
						this.attackTimer.Reset()
						this.sprayTargetPos = null
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