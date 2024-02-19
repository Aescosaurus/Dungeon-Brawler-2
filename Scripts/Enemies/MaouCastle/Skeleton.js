class Skeleton extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Skeleton.png" )
		this.col = "ghostwhite"
		this.hp = 7
		
		this.spd = 0.4
		
		this.attackTimer = new Timer( 2.5,false,true )
		this.attackPattern = new ShotPattern( 1 )
		this.bulletSpd = 1.2
		this.bulletRange = 80
	}
}