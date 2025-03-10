class CabbageRoller extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/CabbageRoller.png" )
		this.hp = 11
		
		this.spd = 0.4
		this.moveDelay = new Timer( 3.0,true )
		
		this.attackPattern = null
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),10,0.15,3,true )
		this.bulletSpd = 1.7
		this.bulletRange = 80
		this.targetStyle = TargetFinder.FindRandom
		
		this.attackTimer = new Timer( 1.5,false,true )
		this.targetPos = null
	}
}