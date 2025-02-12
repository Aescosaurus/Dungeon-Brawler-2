class Rogue extends Player
{
	constructor( pos,ctrls )
	{
		super( pos,ctrls,4,"Images/Char/Rogue.png" )
		
		this.sprSht = new SprSheet( SpriteCodex.LoadSpr( "Images/Char/RogueInvis.png" ),8,8 )
		this.idleAnim = new Anim( this.sprSht,0,2 )
		this.walkAnim = new Anim( this.sprSht,1,2 )
		this.normalAnimHand = this.animHand
		this.invisAnimHand = new AnimHandler( [ this.idleAnim,this.walkAnim ] )
		
		this.spd = 1.85
		
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Items/Dagger.png" )
		this.bulletRot = 45
		
		this.refire.SetDur( 0.2 )
		// double daggers?
		this.shotPattern = new ShotPattern( 2,10 )
		this.attackRange = 80
		this.bulletSpd = 3
		this.bulletDmg = 0.85
		
		this.aimMove = Vec2.Zero()
		
		this.invisTimer = new Timer( 3.0,true )
	}
	
	Update( info )
	{
		super.Update( info )
		
		if( !this.move.Equals( Vec2.Zero() ) ) this.aimMove.Set( this.move )
		
		if( this.refire.Update() && info.enemies.length > 0 )
		{
			this.refire.Reset()
			// const ang = Math.atan2( this.aimMove.y,this.aimMove.x )
			const angs = this.shotPattern.GetShotAngles( this.pos,this.pos.Copy().Add( this.aimMove ) )
			for( const ang of angs ) this.FireBullet( ang,info )
		}
		
		if( this.invisTimer.Update() )
		{
			this.targetable = true
			this.animHand = this.normalAnimHand
		}
	}
	
	UseSuper( info )
	{
		this.invisTimer.Reset()
		this.targetable = false
		this.animHand = this.invisAnimHand
	}
}