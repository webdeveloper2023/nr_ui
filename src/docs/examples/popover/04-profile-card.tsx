import { useState } from "react";
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

export default function PopoverProfileCard() {
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex justify-center">
      <Popover placement="bottom">
        <PopoverTrigger>
          <button className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-focus">
            <Avatar name="Rafiqjon Nazirov" color="accent" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name="Rafiqjon Nazirov" color="accent" />
              <div>
                <p className="text-sm font-medium text-foreground">Rafiqjon Nazirov</p>
                <p className="text-xs text-muted">@rafiqjon</p>
              </div>
            </div>
            <Button size="sm" variant={following ? "tertiary" : "primary"} onClick={() => setFollowing(!following)}>
              {following ? "Following" : "Follow"}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted">Product designer. Into design systems and micro-interactions.</p>
          <div className="mt-3 flex gap-4 text-sm">
            <span>
              <b className="font-medium text-foreground">128</b> <span className="text-muted">Following</span>
            </span>
            <span>
              <b className="font-medium text-foreground">4.2K</b> <span className="text-muted">Followers</span>
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
