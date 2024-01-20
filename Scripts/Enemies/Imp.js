class Imp extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Imp.png" )
		
		this.hp = 12
		
		this.spd = 0.6
		this.moveDelay.SetDur( 0.2 )
		
		this.ai = new PredictTargetAI( 5 )
		
		this.attackTimer = new Timer( 2,false,true )
		this.attackPattern = new PredictShotPattern( 3,15,false,15 )
		this.bulletSpd = 0.8
		this.bulletRange = 50
	}
}