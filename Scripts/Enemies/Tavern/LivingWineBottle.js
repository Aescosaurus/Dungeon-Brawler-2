class LivingWineBottle extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/LivingWineBottle.png" )
		this.hp = 7
		
		this.spd = 0.3
		this.moveDelay.SetDur( 0.7 )
		
		this.attackTimer = new Timer( 3,false,true )
		this.attackPattern = new ShotPattern( 4,0,true,45 )
		this.bulletSpd = 0.6
		this.bulletRange = 100
		this.targetStyle = TargetFinder.Up
	}
	
	Update( info )
	{
		if( this.attackTimer.GetPercent() < 0.8 ) this.UpdateMove( info )
		
		this.UpdateAttack( info )
		
		this.UpdateAnim()
	}
}