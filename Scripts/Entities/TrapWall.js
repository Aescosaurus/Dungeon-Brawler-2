class TrapWall extends Enemy
{
	constructor( pos,trapDir,map )
	{
		super( pos,"Images/Enemy/TrapWall.png" )
		
		this.ai = new StandStillAI()
		this.attackPattern = null
		this.bulletSpd = 0.6
		
		this.trapDir = trapDir
		this.shotDir = Vec2.Cardinals()[this.trapDir]
		this.shotAng = Math.atan2( this.shotDir.y,this.shotDir.x )
		this.shotSpot = this.pos.Copy().Add( this.shotDir.Copy().Scale( 8 ) )
		
		let curPos = map.World2TilePos( pos ).Add( this.shotDir )
		while( map.IsWalkableTile( curPos.x,curPos.y ) ) curPos.Add( this.shotDir )
		
		curPos = map.Tile2WorldPos( curPos )
		
		const hitboxWidth = 2
		const endPos = map.Tile2WorldPosCentered( curPos )
		if( this.trapDir < 2 ) this.hitbox = new Rect( Math.min( curPos.y,pos.y ),Math.max( curPos.y,pos.y ),
			pos.x - hitboxWidth,pos.x + hitboxWidth )
		else this.hitbox = new Rect( pos.y - hitboxWidth,pos.y + hitboxWidth,
			Math.min( curPos.x,pos.x ),Math.max( curPos.x,pos.x ) )
		this.bulletRange = Math.max( this.hitbox.GetWidth(),this.hitbox.GetHeight() )
		
		this.overlappingPlayers = []
		this.playerResetCheck = new Timer( 5.0 )
	}
	
	Update( info )
	{
		super.Update( info )
		
		const playerTargets = info.playerManager.GetPlayerTargets()
		for( const player of playerTargets )
		{
			if( this.hitbox.Contains( player.pos ) )
			{
				if( !this.overlappingPlayers.includes( player ) ) this.FireBullet( this.shotAng,info )
				this.overlappingPlayers.push( player )
			}
			else
			{
				for( let i = 0; i < this.overlappingPlayers.length; ++i )
				{
					if( this.overlappingPlayers[i] == player || !this.overlappingPlayers[i].targetable )
					{
						this.overlappingPlayers.splice( i--,1 )
					}
				}
			}
		}
	}
	
	Draw( gfx )
	{
		const drawPos = this.pos.Copy().Subtract( this.sprSht.GetItemSize().Copy().Divide( 2 ) )
		this.sprSht.Draw( drawPos.x,drawPos.y,0,this.trapDir,gfx )
		
		// gfx.DrawRect( this.hitbox.left,this.hitbox.top,this.hitbox.GetWidth(),this.hitbox.GetHeight(),"#FFDD00" )
	}
	
	FireBullet( ang,info,spd = this.bulletSpd,range = this.bulletRange )
	{
		const oldPos = this.pos
		this.pos = this.shotSpot
		super.FireBullet( ang,info,spd,range )
		this.pos = oldPos
	}
}