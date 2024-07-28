class EnemyHitParticle extends Particle
{
	constructor( pos,bulletVel,hitColors,dmg )
	{
		// const mySpd = Utils.RandFloat( 0.01,0.2 ) * dmg
		const mySpd = Utils.RandFloat( 0.4,1.6 )
		
		const mySize = Utils.RandFloat( 1,3 ) * EnemyHitParticle.bulletSizing[
			Math.min( Math.floor( dmg ),EnemyHitParticle.bulletSizing.length - 1 )]
		
		super( pos,Utils.ArrayChooseRand( hitColors ),
			[
				new LifetimePartMod( Utils.RandInt( 7,40 ) ),
				// new StartVelAngPartMod( Math.atan2( bulletVel.y,bulletVel.x ),45,mySpd ),
				new StartVelPartMod( bulletVel.Copy().Normalize().Scale( mySpd ),mySpd ),
				new StartSizePartMod( mySize )
			] )
	}
}
EnemyHitParticle.bulletSizing = [ 1.0,1.2,1.35,1.5,1.65,1.83 ]