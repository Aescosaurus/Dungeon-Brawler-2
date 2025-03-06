class TargetDummy extends Enemy
{
	constructor( pos )
	{
		super( pos )
		
		this.sprSht = new SprSheet( new Sprite( "Images/Enemy/Scarecrow.png" ),8,8 )
		this.hurtAnim = new Anim( this.sprSht,0,3,0 )
		
		this.hp = 99999
		this.spd = 0.0
		this.ai = new StandStillAI()
		
		this.hurtTimer = new Timer( 0.1 )
		
		this.ToggleInvul( true )
	}
	
	Update( info )
	{
		// no super.Update
		
		if( this.hurtTimer.Update() ) this.hurtAnim.SetFrame( 0 )
	}
	
	UpdateAnim()
	{
		// intentionally left empty
	}
	
	Draw( gfx )
	{
		this.hurtAnim.Draw( this.pos.Copy().Subtract( this.sprSht.GetItemSize().Copy().Divide( 2 ) ),
			gfx,-1 )
	}
	
	Damage( dmg,attacker )
	{
		super.Damage( dmg,attacker )
		
		this.hurtTimer.Reset()
		this.hurtAnim.SetFrame( 2 )
	}
}