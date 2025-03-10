class Wolf extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Wolf.png" )
		this.hp = 17
		
		this.spd = 0.27
		
		this.attackTimer = new Timer( 2.5,false,true )
		this.attackPattern = new ShotPattern( 4,-1,true,45 )
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),0,0.3,2 )
		this.bulletSpd = 1.3
		this.bulletRange = 190
		this.targetStyle = TargetFinder.FindClosest
		
		this.curAttack = 0
	}
}