class Scarecrow extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Scarecrow.png" )
		this.hp = 19
		
		this.spd = 0.14
		
		this.attackTimer = new Timer( 2.5,false,true )
		this.attackPattern = new ShotPattern( 4,-1,true,45 )
		this.bulletSpd = 0.9
		this.bulletRange = 220
		this.targetStyle = TargetFinder.FindClosest
		
		this.attackTimer2 = new Timer( 1.5,false,true )
		
		this.curAttack = 0
	}
	
	UpdateAttack( info )
	{
		super.UpdateAttack( info )
		
		if( this.attackTimer2.Update() )
		{
			this.attackTimer2.Reset()
			
			const target = TargetFinder.FindFarthest( this,info.players )
			if( target != null )
			{
				// need to pass target here for PredictShotPattern
				const angs = this.attackPattern.GetShotAngles( this.pos,target.pos,target )
				for( const ang of angs ) this.FireBullet( ang,info )
			}
		}
	}
}