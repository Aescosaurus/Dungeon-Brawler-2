class Healer extends Player
{
	constructor( pos,ctrls )
	{
		super( pos,ctrls,8,"Images/Char/Healer.png" )
		
		this.spinRange = 32
		this.spinSpd = 5
		this.mace = null
		
		this.nSuperHealBaubles = 12
		
		this.maceChainSpr = SpriteCodex.LoadSpr( "Images/Bullet/MaceChain.png" )
	}
	
	Update( info )
	{
		super.Update( info )
		
		if( this.mace == null && info.enemies.length > 0 )
		{
			this.mace = new MaceBullet( this,this.spinRange,this.spinSpd )
			info.playerBullets.push( this.mace )
		}
		else if( info.enemies.length > 0 )
		{
			this.mace.KeepAlive()
			const diff = this.mace.pos.Copy().Subtract( this.pos )
			this.mace.angle = Utils.Rad2Deg( Math.atan2( diff.y,diff.x ) )
		}
		else this.mace = null
	}
	
	UseSuper( info )
	{
		const spawnSpots = []
		for( let y = 1; y < info.map.height - 1; ++y )
		{
			for( let x = 1; x < info.map.width - 1; ++x )
			{
				if( info.map.IsWalkableTile( x,y ) ) spawnSpots.push( new Vec2( x,y ) )
			}
		}
		
		const nBaubles = Math.min( this.nSuperHealBaubles,spawnSpots.length )
		
		spawnSpots.sort( function() { return( Math.random() - 0.5 ) } )
		
		for( let i = 0; i < nBaubles; ++i )
		{
			const healSpot = info.map.Tile2WorldPos( spawnSpots[i] )
				.Add( Vec2.One().Scale( info.map.tileSize / 2 ) )
			
			const healBauble = new HealBauble( this.pos,healSpot,0.5 )
			info.enemyBullets.push( healBauble )
		}
	}
	
	Draw( gfx )
	{
		if( this.mace )
		{
			const diff = this.mace.pos.Copy().Subtract( this.pos )
			const chainAng = Utils.Rad2Deg( Math.atan2( diff.y,diff.x ) )
			
			const dir = diff.Normalize()
			const chainScale = 1
			const chainSize = 3 * chainScale
			for( let i = 0; i < this.spinRange; i += chainSize )
			{
				const chainPos = this.pos.Copy().Add( dir.Copy().Scale( i ) )
				gfx.DrawSpriteRotatedScaled( chainPos.x,chainPos.y,
					this.maceChainSpr,
					chainScale,chainScale,
					chainAng )
			}
		}
		
		super.Draw( gfx )
	}
	
	OnKill()
	{
		this.mace = null
	}
}