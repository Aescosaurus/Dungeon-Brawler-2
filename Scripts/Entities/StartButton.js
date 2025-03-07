class StartButton extends Entity
{
	constructor( pos )
	{
		super( pos,Vec2.One() )
		
		this.spr = new Sprite( "Images/UI/StartButton.png" )
		this.noGhostsSpr = new Sprite( "Images/UI/NoGhosts.png" )
		
		this.noGhosts = true
		
		this.progressStart = this.x
		this.progress = 0
		this.progressRate = 0.5
		this.progressDecay = 0.5
		this.notStandingDebuff = 0.7
		
		this.started = false
	}
	
	Update( info )
	{
		if( this.started ) return
		
		const players = info.playerManager.GetAllPlayers()
		this.noGhosts = true
		let standing = 0
		let notStanding = 0
		for( const player of players )
		{
			if( this.spr.Contains( player.pos.x,player.pos.y,this.pos.x,this.pos.y,true ) )
			{
				if( player.isGhost ) this.noGhosts = false
				else ++standing
			}
			else if( !player.isGhost ) ++notStanding
		}
		if( standing > 0 )
		{
			const nPlayers = info.playerManager.GetLivingPlayers().length
			this.progress += ( Math.max( 0.1,standing - notStanding * this.notStandingDebuff ) / nPlayers ) * this.progressRate
			if( this.progress > this.spr.width && this.spr.width > 0 )
			{
				this.progress = this.spr.width
				this.started = true
				info.areaManager.LeaveCharSelect()
			}
		}
		else if( this.progress > 0 )
		{
			this.progress -= this.progressDecay
			if( this.progress < 0 ) this.progress = 0
		}
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.pos.x,this.pos.y,this.spr,false,true )
		
		if( !this.noGhosts ) gfx.DrawSprite( this.pos.x,this.pos.y - 18,this.noGhostsSpr,false,true )
		
		if( this.progress > 0 )
		{
			gfx.DrawRect( Math.floor( this.pos.x - this.spr.width ),
				Math.floor( this.pos.y - this.spr.height + 16 ),
				Math.floor( this.progress ),
				4,"#9bf4ff" )
		}
	}
}