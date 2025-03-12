class LivingTree extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/LivingTree.png" )
		this.hp = 24
		
		this.spd = 0.1
		
		this.attackTimer = new Timer( 2.9,false,true )
		this.sprayTimer = new Timer( 2.0,false,true )
		this.attackPattern = new ShotPattern( 8,-1,true )
		this.sprayPattern = new SprayPattern( new ShotPattern( 1 ),0,0.3,3 )
		this.bulletSpd = 1.3
		this.bulletRange = 190
	}
}