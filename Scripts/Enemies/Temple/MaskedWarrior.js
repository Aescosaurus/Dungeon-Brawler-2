class MaskedWarrior extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/MaskedWarrior.png" )
		this.hp = 33
		
		this.spd = 0.4
		
		this.attackTimer = new Timer( 1,false,true )
		this.attackPattern = new ShotPattern( 1 )
		this.sprayTimer = new Timer( 3.5,false,true )
		this.sprayPattern = new SprayPattern( new ShotPattern( 2 ),10,0.25,3,true )
		this.bulletSpd = 0.9
		this.bulletRange = 240
	}
}