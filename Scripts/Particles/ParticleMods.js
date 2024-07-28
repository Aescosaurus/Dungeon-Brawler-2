class ParticleMod
{
	Setup( self )
	{
		this.self = self
	}
	Update( info ) {}
}

class LifetimePartMod extends ParticleMod
{
	constructor( lifetime )
	{
		super()
		this.life = lifetime
	}
	
	Update( info )
	{
		if( --this.life < 0 ) this.self.dead = true
	}
}

class StartVelPartMod extends ParticleMod
{
	constructor( vel,variance = 0 )
	{
		super()
		const hv = variance / 2
		this.vel = vel.Add( new Vec2( Utils.RandFloat( -hv,hv ),Utils.RandFloat( -hv,hv ) ) )
	}
	
	Update( info )
	{
		this.self.pos.Add( this.vel )
	}
}

class StartVelAngPartMod extends StartVelPartMod
{
	constructor( ang,variance,spd )
	{
		ang += Utils.Deg2Rad( Utils.RandFloat( -0.5,0.5 ) * variance )
		super( new Vec2( Math.cos( ang ),Math.sin( ang ) ).Scale( spd ) )
	}
}

class StartSizePartMod extends ParticleMod
{
	constructor( size )
	{
		super()
		
		this.size = size
	}
	
	Setup( self )
	{
		super.Setup( self )
		
		self.size = Vec2.One().Scale( this.size )
	}
}